// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  // Logika untuk menyimpan pesan baru
async createMessage(senderId: string, recipientId: string, text: string) {
  // Bagian ini tetap sama
  let conversation = await this.conversationModel.findOne({
    participants: { $all: [senderId, recipientId] },
  });

  if (!conversation) {
    conversation = await this.conversationModel.create({
      participants: [senderId, recipientId],
    });
  }

  const newMessage = new this.messageModel({
    sender: senderId,
    conversation: conversation._id,
    text,
  });

  await newMessage.save();

  const populatedMessage = await this.messageModel
    .findById(newMessage._id)
    .populate('sender', 'username _id');

  console.log('Pesan setelah di-populate:', populatedMessage);

  return populatedMessage;
}
  
  async getMessages(userId1: string, userId2: string) {
  const conversation = await this.conversationModel.findOne({
    participants: { $all: [userId1, userId2] },
  });

  if (!conversation) {
    return []; // Jika belum ada percakapan, kembalikan array kosong
  }

  return this.messageModel
    .find({ conversation: conversation._id })
    .sort({ createdAt: 1 }) // Urutkan dari yang paling lama
    .populate('sender', 'username _id') // Sertakan data pengirim
    .exec();
  }
}