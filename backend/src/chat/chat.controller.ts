// src/chat/chat.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':otherUserId')
  getMessages(@Param('otherUserId') otherUserId: string, @Req() req) {
    console.log(`Mencoba mengambil pesan antara ${req.user.username} dan user ID ${otherUserId}`);
    const currentUserId = req.user.userId;
    return this.chatService.getMessages(currentUserId, otherUserId);
  }
}