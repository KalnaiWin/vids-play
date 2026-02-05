import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './application/port/auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/domain/user.entity';
import { AuthController } from './presenters/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthRepository],
})
export class AuthModule {}
