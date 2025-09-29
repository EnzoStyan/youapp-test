import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private jwtService: JwtService,
) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, username, password } = registerUserDto;

    
    const existingUser = await this.userModel.findOne({ $or: [{ email }, { username }] }).exec();
    if (existingUser) {
      throw new ConflictException('Email or username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
    });

    
    return createdUser.save();
  }

  async login(LoginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email, password } = LoginUserDto;

    const user = await this.userModel.findOne({ email }).exec();
    if(!user){
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}