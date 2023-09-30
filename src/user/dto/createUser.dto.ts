import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserLoginDTO } from './userLogin.dto';

export class CreateUserDTO extends UserLoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}