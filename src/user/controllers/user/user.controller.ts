import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Req, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { SuccessResponse} from 'src/utils/dto/successResponse.dto';
import { UserLoginDTO } from 'src/user/dto/userLogin.dto';
import { UserService } from 'src/user/service/user/user.service';
import {Request} from 'express';
import { UserJWTPayload } from 'src/auth/middleware/verify-token/verify-token.middleware';
import { KeyToken } from 'src/key-token/schemas/key-token.schema';



@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private userService: UserService){}
    
    @HttpCode(200)
    @Get()
    getUsers(){
        return ['user']
    }

    @HttpCode(200)
    @Post('login') 
    handleLogin(@Body() user:UserLoginDTO)
    { 
        return this.userService.login(user)
    }

    @HttpCode(201)
    @Post('signup') 
    handleSignup(@Body() user:CreateUserDTO):Promise<SuccessResponse>
    {
        return this.userService.signUp(user);
    }

    @HttpCode(200)
    @Post('logout') 
    handleLogout(@Req() req:Request ):Promise<SuccessResponse>
    { 
        const {_id} = req['keyStore']; 
        return this.userService.logout(_id);
    }

    @Get('refreshToken')
    refreshToken(@Req() req:Request){
        
        const [refreshToken,user,keyStore]:[string,UserJWTPayload,KeyToken] = [req['refreshToken'],req['user'],req['keyStore']];

        return this.userService.refreshToken(keyStore,user,refreshToken);
    }


}
