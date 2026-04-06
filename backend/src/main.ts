import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', '..', '..', 'frontend', 'dist'));
  app.use('/{*path}', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(
      join(__dirname, '..', '..', '..', 'frontend', 'dist', 'index.html'),
    );
  });
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
