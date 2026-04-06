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

    // Serve frontend static files
  app.useStaticAssets(join(__dirname, '..', 'build'));
  // Catch-all — must be last
  app.use('/{*path}', (req, res) => {
    res.sendFile(join(__dirname, '..', 'build', 'index.html'));
  });


  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
