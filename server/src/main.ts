import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import express from 'express';
import * as cors from 'cors';
import path from 'path';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, Set-Cookie',
      exposedHeaders: 'Set-Cookie',
    }),
  );
  await app.listen(3000);
}
bootstrap();
