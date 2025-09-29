import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getProfile(@Req() req) {
        const userId = req.user.userId;
        return this.profileService.getProfile(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put()
    async updateProfile(
        @Req() req,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        const userId = req.user.userId;
        return this.profileService.updateProfile(userId, updateProfileDto);
    }
}
