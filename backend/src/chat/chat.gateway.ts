// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../auth/guard/ws.guard';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@UseGuards(WsGuard)
@WebSocketGateway({ cors: { origin: 'http://localhost:3001' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private onlineUsers = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('No token provided');
      
      const payload = this.jwtService.verify(token);
      client.data.user = payload;

      const user = client.data.user;
      this.onlineUsers.set(user.sub, client.id);
      console.log(`${user.username} terhubung, total online: ${this.onlineUsers.size}`);

    } catch (error) {
      console.log('Koneksi tidak sah, memutuskan...');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user) {
      const user = client.data.user;
      // PASTIKAN INI MENGGUNAKAN .sub
      this.onlineUsers.delete(user.sub);
      console.log(`${user.username} terputus, total online: ${this.onlineUsers.size}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { recipientId: string; text: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sender = client.data.user;
    const { recipientId, text } = data;

    console.log('--- DEBUGGING SEND MESSAGE ---');
    console.log('Isi dari variabel "sender" (client.data.user):', sender);
    console.log('Mencoba memanggil createMessage dengan sender ID:', sender.sub);
    console.log('------------------------------');

    const savedMessage = await this.chatService.createMessage(
      // PASTIKAN INI MENGGUNAKAN .sub
      sender.sub,
      recipientId,
      text,
    );
    
    const recipientSocketId = this.onlineUsers.get(recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('newMessage', savedMessage);
    }
    
    client.emit('newMessage', savedMessage);
  }
}