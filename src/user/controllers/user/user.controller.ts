import { 
    Body, ClassSerializerInterceptor, 
    Controller, Get, HttpCode, Post, Req, Res ,
    UseGuards, UseInterceptors,SetMetadata
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
import { RedirectURLObj } from 'src/user/utils/custom types/redirectURL.type';
import { ResetPasswordDTO } from 'src/user/dto/resetPassword.dto';
import { GoogleService, UserFromGoogle } from 'src/auth/google/service/google/google.service';


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
        return this.userService.logout(req['keyStore']._id);
    }

    @Get('refreshToken')
    refreshToken(@Req() req:Request)
    {
        return this.userService.refreshToken(req['keyStore'],req['user']as UserJWTPayload,req['refreshToken']);
    }
    @HttpCode(200)
    @Post('verifyChangePassword')
    sendEmailChangePassword(@Body() emailPayload:EmailDTO){
        return this.mailService.sendVerifyChangePassword(emailPayload);
    }

    @HttpCode(200)
    @Post('changePassword')
    changePassword(@Body() resetPasswordPayload:ResetPasswordDTO){
        return this.userService.resetPassword(resetPasswordPayload);
    }


    @Get('auth/google')
    @AllowUnauthorizedRequest()
    @UseGuards(AuthGuard('google'))
    googleAuth(next:NextFunction){
        return next();  
    }

    @Get('auth/googleRedirect')
    @AllowUnauthorizedRequest()
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req:Request , @Res() res:Response) {
        
        const googleUser:UserFromGoogle = await this.googleService.googleLogin(req,res);
        
        const {userId,accessToken,refreshToken} = await this.userService.login(googleUser) as RedirectURLObj;
        
        res.redirect(`${process.env.CLIENT_REDIRECT_URL}?userId=${userId}&accessToken=${accessToken}$refreshToken=${refreshToken}`);
    
    }
}




