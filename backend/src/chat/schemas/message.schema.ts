// src/chat/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Conversation } from './conversation.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'}) // <-- PERBAIKAN DI SINI
    sender: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'})
    conversation: Conversation;

    @Prop({ required: true, trim: true })
    text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);