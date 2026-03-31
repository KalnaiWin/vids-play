import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: configService.get('firebase.project_id'),
              clientEmail: configService.get('firebase.client_email'),
              privateKey: configService
                .get<string>('firebase.private_key')
                ?.replace(/\\n/g, '\n')
                .trim(),
            }),
          });
        }
        return admin.messaging();
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseAdminModule {}
