import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { SuccessResponse} from 'src/utils/dto/successResponse.dto';
import { UserLoginDTO } from 'src/user/dto/userLogin.dto';
import { UserService } from 'src/user/service/user/user.service';
import { Request, NextFunction } from 'express';
import { UserJWTPayload } from 'src/auth/middleware/verify-token/verify-token.middleware';
import { KeyToken } from 'src/key-token/schemas/key-token.schema';
import { MailService } from 'src/mail/service/mail/mail.service';
import { GoogleService, UserFromGoogle } from 'src/auth/google/service/google/google.service';
import { AuthGuard } from '@nestjs/passport';
import { 
    Body, ClassSerializerInterceptor, 
    Controller, Get, HttpCode, Post, Req, 
    UseGuards, UseInterceptors,SetMetadata 
} from '@nestjs/common';

const AllowUnauthorizedRequest = () => SetMetadata('allowUnauthorizedRequest', true);

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private userService: UserService,
        private mailService:MailService,
        private googleService:GoogleService
    ){}
    
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
    refreshToken(@Req() req:Request)
    {
        const [refreshToken,user,keyStore]:[string,UserJWTPayload,KeyToken] = [req['refreshToken'],req['user'] as UserJWTPayload,req['keyStore']];
        return this.userService.refreshToken(keyStore,user,refreshToken);
    }

    // @Post('verifyChangePassword')
    // sendEmailChangePassword(){
    //     return this.mailService.sendVerifyChangePassword();
    // }

    @Get('auth/google')
    @AllowUnauthorizedRequest()
    @UseGuards(AuthGuard('google'))
    googleAuth(@Req() req:Request,next:NextFunction){
        return next();  
    }

    @Get('auth/googleRedirect')
    @AllowUnauthorizedRequest()
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req:Request) {
        const googleUser:UserFromGoogle = await this.googleService.googleLogin(req);
        return this.userService.login(googleUser);
    }
}




