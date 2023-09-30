import {IsNotEmpty } from 'class-validator';

export class UserLoginDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}