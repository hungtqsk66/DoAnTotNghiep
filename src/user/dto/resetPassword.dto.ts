import {IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO{
    @IsNotEmpty()
    userId:string;

    @IsNotEmpty()
    resetToken:string;

    @IsNotEmpty()
    password:string
}