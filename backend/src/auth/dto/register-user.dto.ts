import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsEmail({}, { message: 'Please Provide a valid email!' })
    @IsNotEmpty({ message: 'Email should not be empty!' })
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long!' })
    password: string;
    
}