import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './application/port/auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/domain/user.schema';
import { AuthController } from './presenters/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.access.secret'),
        signOptions: {
          expiresIn: config.get('jwt.access.expiresIn'),
        },
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthGuard],
  exports: [AuthRepository, AuthGuard],
})
export class AuthModule {}
