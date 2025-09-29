import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { getZodiacSign, getChineseZodiac } from 'src/utils/zodiac.helper';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>
    ) {}

    async getProfile(userId: string): Promise<Profile | null> {
        return this.profileModel.findOne({ user: userId }).exec();    
    }

    async updateProfile(
        userId: string, 
        updateProfileDto: UpdateProfileDto
    ): Promise<Profile> {
        if (updateProfileDto.birthday) {
            const birthday = new Date(updateProfileDto.birthday);
            const day = birthday.getDate();
            const month = birthday.getMonth() + 1; // Months are zero-based
            const year = birthday.getFullYear();
        
            const zodiac = getZodiacSign(day, month);
            const horoscope = getChineseZodiac(year);

            (updateProfileDto as any).zodiac = zodiac;
            (updateProfileDto as any).horoscope = horoscope;
        }
        return this.profileModel.findOneAndUpdate(
            { user: userId },
            { $set: updateProfileDto },
            { new: true, upsert: true }
        ).exec();
    }
}
