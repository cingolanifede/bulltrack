import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.validation';

async function bootstrap() {
  const env = validateEnv();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const corsOrigin = env.CORS_ORIGIN
    ? env.CORS_ORIGIN.split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : true;
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(env.PORT);
  console.log(`Bulltrack API running on http://localhost:${env.PORT}`);
}
bootstrap();
