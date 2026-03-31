import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InputCreateNotification } from './notification.dto';
import { User } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notification.schema';
import { UserRepository } from 'src/user/user.repository';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private userRepository: UserRepository,
    @Inject('FIREBASE_ADMIN') private readonly fcm: admin.messaging.Messaging,
  ) {}

  async checkReadNotification(userId: string, notificationId: string) {
    const existingAuthor = await this.userModel.findById(userId);
    if (!existingAuthor) throw new NotFoundException('Author not found');
    const existingNotification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      {
        $set: {
          isRead: true,
        },
      },
    );
    if (!existingNotification)
      throw new NotFoundException('Notification not found');
  }

  async createNotification(data: InputCreateNotification) {
    if (!data.title) throw new BadRequestException('Title should not be empty');

    const existingAuthor = await this.userModel.findById(data.ownerId);
    if (!existingAuthor)
      throw new NotFoundException('AuthorId not found to create notification');

    const subscriberDoc = await this.userRepository.getSubscribersOfChannelId(
      String(data.ownerId),
    );

    const subscriberIds = subscriberDoc.map((doc) => doc.subscriber);

    if (!subscriberIds.length) return;

    // 1. Persist notifications to DB
    const newNotifications = subscriberIds.map((subId) => ({
      sender: new Types.ObjectId(data.ownerId),
      receiver: new Types.ObjectId(subId),
      refId: data.refId,
      image: data.image,
      title: data.title,
      type: data.type,
    }));

    await this.notificationModel.insertMany(newNotifications);

    // 2. Fetch FCM tokens for all subscribers in one query
    const subscriberDocs = await this.userModel
      .find({ _id: { $in: subscriberIds } })
      .select('fcmTokens')
      .lean();

    const allTokens = subscriberDocs.flatMap((u) => u.fcmTokens ?? []);

    if (!allTokens.length) return;

    // 3. Send FCM push notifications
    await this.sendFcmToTokens(allTokens, {
      title: existingAuthor.name,
      avatar: existingAuthor.avatarUrl,
      body: data.title,
      image: data.image,
      refId: String(data.refId),
    });
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private async sendFcmToTokens(
    tokens: string[],
    payload: {
      title: string;
      avatar: string;
      body: string;
      image?: string;
      refId: string;
    },
  ) {
    const chunks = this.chunkArray(tokens, 500); // FCM max 500 per multicast

    const results = await Promise.allSettled(
      chunks.map((chunk) =>
        this.fcm.sendEachForMulticast({
          tokens: chunk,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.image,
          },
          data: {
            ...(payload.refId && { refId: payload.refId }),
            ...(payload.avatar && { avatar: payload.avatar }),
            ...(payload.image && { image: payload.image }),
          },
        }),
      ),
    );

    // 4. Collect stale/invalid tokens
    const staleTokens: string[] = [];

    results.forEach((result, chunkIdx) => {
      if (result.status === 'fulfilled') {
        result.value.responses.forEach((resp, tokenIdx) => {
          if (!resp.success) {
            const code = resp.error?.code;
            if (
              code === 'messaging/invalid-registration-token' ||
              code === 'messaging/registration-token-not-registered'
            ) {
              staleTokens.push(chunks[chunkIdx][tokenIdx]);
            }
          }
        });
      } else {
        this.logger.error('FCM multicast chunk failed', result.reason);
      }
    });

    // 5. Remove stale tokens from all user documents
    if (staleTokens.length) {
      await this.userModel.updateMany(
        { fcmTokens: { $in: staleTokens } },
        { $pull: { fcmTokens: { $in: staleTokens } } },
      );
      this.logger.log(`Removed ${staleTokens.length} stale FCM token(s)`);
    }

    const totalSuccess = results.reduce(
      (sum, r) => sum + (r.status === 'fulfilled' ? r.value.successCount : 0),
      0,
    );

    this.logger.log(`FCM sent: ${totalSuccess}/${tokens.length} succeeded`);
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );
  }
}
