import { 
    Body,Controller, Get, HttpCode, Post, Req, Res ,
    UseGuards, UseInterceptors,ClassSerializerInterceptor, Query, Delete,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request,Response, NextFunction } from 'express';
import { EmailDTO } from 'src/Dtos/email.dto';
import { UserService } from 'src/services/user.service';
import { MailService } from 'src/services/mail.service';
import { UserLoginDTO } from 'src/Dtos/userLogin.dto';
import { CreateUserDTO } from 'src/Dtos/createUser.dto';
import { SuccessResponse} from 'src/Types/successResponse';
import { ResetPasswordDTO } from 'src/Dtos/resetPassword.dto';
import { GoogleService} from 'src/auth/google/service/google/google.service';
import { AllowUnauthorizedRequest } from 'src/auth/google/utils/excepts.guard';
import { UserLoginSuccessDTO } from 'src/Dtos/userLoginSuccess.dto';
import { RedirectUrlDTO } from 'src/Dtos/redirectURL.dto';
import { UserCreateSuccessDTO } from 'src/Dtos/userCreateSuccess.dto';
import { UserJwtDTO } from 'src/Dtos/userJWT.dto';
import { UserVerifiedDTO } from 'src/Dtos/verifiedUser.dto';
import { UserTokenDTO } from 'src/Dtos/userToken.dto';
import { UserPlaylistService } from 'src/services/user-playlist.service';
import { CreatePlaylistDTO } from 'src/Dtos/createPlaylist.dto';
import { AddSongToPlaylistDTO } from 'src/Dtos/addSongToPlaylist.dto';
import { UserPlayListDTO } from 'src/Dtos/userPlaylist.dto';
import { KeyTokenService } from '../services/key-token.service';




@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private userService: UserService,
        private mailService:MailService,
        private googleService:GoogleService,
        private userPlaylistService:UserPlaylistService,
        private keyTokenService:KeyTokenService
    ){}
    

    @HttpCode(200)
    @Post('login') 
    async handleLogin(@Body() user:UserLoginDTO):Promise<SuccessResponse<UserLoginSuccessDTO> | RedirectUrlDTO>
    { 
        return await this.userService.login(user);
    }

    @HttpCode(201)
    @Post('signup') 
    async handleSignup(@Body() newUser:CreateUserDTO):Promise<SuccessResponse<UserCreateSuccessDTO>>
    {
        return await this.userService.signUp(newUser);
    }

    @HttpCode(200)
    @Post('logout') 
    async handleLogout(@Req() req:Request ):Promise<SuccessResponse>
    { 
        return await this.userService.logout(req['keyStore']._id);
    }

    @HttpCode(200)
    @Get('refreshToken')
    async refreshToken(@Req() req:Request):Promise<SuccessResponse<UserTokenDTO>>
    {
        return new SuccessResponse({metadata:await this.keyTokenService.modifyToken(req['keyStore'],req['user'] as UserJwtDTO,req['refreshToken'])});
    }


    @HttpCode(200)
    @Post('verifyChangePassword')
    async sendEmailChangePassword(@Body() emailPayload:EmailDTO):Promise<SuccessResponse>{
        return await this.mailService.sendVerifyChangePassword(emailPayload);
    }

    @HttpCode(200)
    @Post('changePassword')
    async changePassword(@Body() resetPasswordPayload:ResetPasswordDTO):Promise<SuccessResponse>{
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
    async googleAuthRedirect(@Req() req:Request , @Res() res:Response):Promise<void>{
        
        const googleUser:UserVerifiedDTO = await this.googleService.googleLogin(req,res);
        
        const redirectDTO:RedirectUrlDTO = await this.userService.login(googleUser) as RedirectUrlDTO;
        
        res.redirect(`${process.env.CLIENT_REDIRECT_URL}?userId=${redirectDTO.userId}&userName=${redirectDTO.userName}&accessToken=${redirectDTO.accessToken}&refreshToken=${redirectDTO.refreshToken}`);
    
    }

    @Get('playLists')
    @HttpCode(200)
    async getUserPlaylists(@Req()req:Request):Promise<SuccessResponse<UserPlayListDTO>>
    {
        return await this.userPlaylistService.getUserPlaylists(req.headers['x-client-id'] as string);
    }

    @HttpCode(201)
    @Post('createPlaylist')
    async createUserPlaylist(@Body()newPlayList:CreatePlaylistDTO ,@Req()req:Request):Promise<SuccessResponse>
    {
        return await this.userPlaylistService.createPlaylist(newPlayList.playListName,req);
    }

    @HttpCode(200)
    @Delete('removePlaylist')
    async removePlaylist(@Query('id')id:string,@Req() req:Request): Promise<SuccessResponse>
    {
        return await this.userPlaylistService.removePlaylist(id,req);
    }

    @HttpCode(201)
    @Post('playList/addSong')
    async addSongToPlaylist(@Body()newSongToPlaylist:AddSongToPlaylistDTO ,@Req()req:Request):Promise<SuccessResponse>
    {
        return await this.userPlaylistService.addSongToPlaylist(newSongToPlaylist.playListId,newSongToPlaylist.songId,req);
    }

    
    @HttpCode(200)
    @Delete('removeSongFromPlaylist')
    async removeSongFromPlaylist(@Query('playListId')playListId:string,@Query('songId')songId:string,@Req()req:Request): Promise<SuccessResponse>
    {
        return await this.userPlaylistService.removeSongFromPlaylist(playListId,songId,req);
    }





}




