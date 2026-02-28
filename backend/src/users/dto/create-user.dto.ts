import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsDefined,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    @MinLength(6)
    password: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    character: string;
}