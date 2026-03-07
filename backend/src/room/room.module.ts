import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomRepository } from './room.repository';
import { RoomSchema } from './room.schema';
import { UserSchema } from 'src/user/user.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: 'Room',
        schema: RoomSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomRepository, CloudinaryService],
  exports: [RoomService],
})
export class RoomModule {}
