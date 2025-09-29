// src/auth/strategy/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    // Tambahkan pengecekan ini
    if (!secret) {
      throw new Error('JWT_SECRET is not set in the environment variables!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Gunakan variabel secret yang sudah pasti ada
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}