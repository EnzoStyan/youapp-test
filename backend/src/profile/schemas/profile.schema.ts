import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;
    
    @Prop()
    name: string;

    @Prop()
    birthday: Date;

    @Prop()
    height: number;

    @Prop()
    weight: number;

    @Prop({ type: [String]})
    interests: string[];

    @Prop()
    horoscope: string;

    @Prop()
    zodiac: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
