// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_TOKEN,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRE },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
