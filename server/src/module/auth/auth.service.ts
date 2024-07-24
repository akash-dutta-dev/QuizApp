// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserResponseDto } from '../user/dto/user-response.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: UserResponseDto) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyTokenAndSetUser(req: Request): Promise<void> {
    const token = req.cookies['jwt'];
    if (!token) {
      throw new UnauthorizedException('No token found');
    }
    try {
      const payload = this.jwtService.verify(token);
      req.user = payload;
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new UnauthorizedException('Token Expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
