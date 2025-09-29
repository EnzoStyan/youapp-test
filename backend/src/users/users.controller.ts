import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
// import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        console.log("Endpoint GET /users diakses...");
        // const currentUserId = req.user.userId;
        return this.usersService.findAll();
    }
}
