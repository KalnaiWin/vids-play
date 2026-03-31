import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import path from 'path';

@Injectable()
export class FirebaseService {
  private logger = new Logger(FirebaseService.name);

  //   constructor() {
  //     // Prevent re-initialization on hot reload
  //     if (!admin.apps.length) {
  //       const serviceAccountPath = path.resolve(
  //         __dirname,
  //         '/backend/vidsplay-22f0d-firebase-adminsdk-fbsvc-da787fbe2f.json',
  //       );
  //       admin.initializeApp({
  //         credential: admin.credential.cert(serviceAccountPath),
  //       });
  //     }
  //   }

  //   async pushNotification(token: string, title: string, body: string, image?: string) {
  //     const message: admin.messaging.Message = {
  //       notification: {
  //         title,
  //         body,
  //         ...(image && { imageUrl: image }),
  //       },
  //       token,
  //     };

  //     try {
  //       const response = await admin.messaging().send(message);
  //       this.logger.log(`Message sent successfully: ${response}`);
  //       return response;
  //     } catch (error) {
  //       this.logger.error(`Error sending message: ${error}`);
  //       throw error;
  //     }
  //   }

  //   // ✅ Send to multiple specific users at once (up to 500 tokens)
  //   async pushNotificationToMany(tokens: string[], title: string, body: string, image?: string) {
  //     const message: admin.messaging.MulticastMessage = {
  //       notification: {
  //         title,
  //         body,
  //         ...(image && { imageUrl: image }),
  //       },
  //       tokens, // array of FCM tokens
  //     };

  //     try {
  //       const response = await admin.messaging().sendEachForMulticast(message);
  //       this.logger.log(`${response.successCount} messages sent, ${response.failureCount} failed`);

  //       // Log which tokens failed
  //       response.responses.forEach((resp, index) => {
  //         if (!resp.success) {
  //           this.logger.error(`Failed to send to token ${tokens[index]}: ${resp.error}`);
  //         }
  //       });

  //       return response;
  //     } catch (error) {
  //       this.logger.error(`Error sending multicast message: ${error}`);
  //       throw error;
  //     }
  //   }
}
