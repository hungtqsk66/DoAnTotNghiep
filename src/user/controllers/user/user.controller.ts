import { 
    Body,Controller, Get, HttpCode, Post, Req, Res ,
    UseGuards, UseInterceptors,ClassSerializerInterceptor,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request,Response, NextFunction } from 'express';

import { EmailDTO } from 'src/user/dto/email.dto';
import { UserService } from 'src/user/service/user/user.service';
import { MailService } from 'src/mail/service/mail/mail.service';
import { UserLoginDTO } from 'src/user/dto/userLogin.dto';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { SuccessResponse} from 'src/utils/dto/successResponse.dto';
import { UserJWTPayload } from 'src/auth/middleware/verify-token/verify-token.middleware';
import { RedirectURLObj } from 'src/user/utils/Types/redirectURL.type';
import { ResetPasswordDTO } from 'src/user/dto/resetPassword.dto';
import { GoogleService} from 'src/auth/google/service/google/google.service';
import { AllowUnauthorizedRequest } from 'src/auth/google/utils/excepts.guard';
import { UserFromGoogle } from 'src/auth/google/utils/types/user.google.type';




@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private userService: UserService,
        private mailService:MailService,
        private googleService:GoogleService
    ){}
    

    @HttpCode(200)
    @Post('login') 
    async handleLogin(@Body() user:UserLoginDTO)
    { 
        return await this.userService.login(user)
    }

    @HttpCode(201)
    @Post('signup') 
    async handleSignup(@Body() user:CreateUserDTO):Promise<SuccessResponse>
    {
        return await this.userService.signUp(user);
    }

    @HttpCode(200)
    @Post('logout') 
    async handleLogout(@Req() req:Request ):Promise<SuccessResponse>
    { 
        return await this.userService.logout(req['keyStore']._id);
    }

    @Get('refreshToken')
    async refreshToken(@Req() req:Request)
    {
        return await this.userService.refreshToken(req['keyStore'],req['user']as UserJWTPayload,req['refreshToken']);
    }
    @HttpCode(200)
    @Post('verifyChangePassword')
    async sendEmailChangePassword(@Body() emailPayload:EmailDTO){
        return await this.mailService.sendVerifyChangePassword(emailPayload);
    }

    @HttpCode(200)
    @Post('changePassword')
    async changePassword(@Body() resetPasswordPayload:ResetPasswordDTO){
        return await this.userService.resetPassword(resetPasswordPayload);
    }


    @Get('auth/google')
    @AllowUnauthorizedRequest()
    @UseGuards(AuthGuard('google'))
    googleAuth(next:NextFunction){
        return  next();  
    }

    @Get('auth/googleRedirect')
    @AllowUnauthorizedRequest()
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req:Request , @Res() res:Response) {
        
        const googleUser:UserFromGoogle = await this.googleService.googleLogin(req,res);
        
        const {userId,userName,accessToken,refreshToken} = await this.userService.login(googleUser) as RedirectURLObj;
        
        res.redirect(`${process.env.CLIENT_REDIRECT_URL}?userId=${userId}&userName=${userName}&accessToken=${accessToken}&refreshToken=${refreshToken}`);
    
    }
}




