// src/auth/guard/ws.guard.ts

// 1. Impor ExecutionContext
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    // 2. Ganti tipe 'any' menjadi 'ExecutionContext'
    context: ExecutionContext,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      // Attach user data to the socket object for later use
      client.data.user = payload;
      return true;
    } catch (e) {
      return false;
    }
  }
}