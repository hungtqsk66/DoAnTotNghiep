import { ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateUserDTO } from 'src/Dtos/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SuccessResponse } from 'src/Types/successResponse';
import { UserLoginDTO } from 'src/Dtos/userLogin.dto';
import {randomBytes} from 'crypto';
import { TokenPair, createTokenPair } from 'src/auth/middleware/verify-token/utils/token.handle';
import { KeyTokenService } from 'src/services/key-token.service';
import { KeyToken, KeyTokenDocument } from 'src/schemas/key-token.schema';
import { ResetPasswordDTO } from 'src/Dtos/resetPassword.dto';
import { ResetTokenService } from 'src/services/reset-token.service';
import { IUserService } from '../interfaces/IUserService';
import { UserLoginSuccessDTO } from 'src/Dtos/userLoginSuccess.dto';
import { RedirectUrlDTO } from 'src/Dtos/redirectURL.dto';
import { UserCreateSuccessDTO } from 'src/Dtos/userCreateSuccess.dto';
import { UserTokenDTO } from 'src/Dtos/userToken.dto';
import { UserJwtDTO } from 'src/Dtos/userJWT.dto';
import { UserVerifiedDTO } from 'src/Dtos/verifiedUser.dto';
import { DecodedUserDataFromToken } from 'src/Types/decodedUser.type';


@Injectable()
export class UserService implements IUserService{

    constructor(
        @InjectModel(User.name) private readonly userModel:Model<User>,
        private readonly keyTokenService:KeyTokenService,
        private resetTokenService:ResetTokenService
    ){}
    
    
    async login (userPayLoad: UserLoginDTO | UserVerifiedDTO):Promise<SuccessResponse<UserLoginSuccessDTO> | RedirectUrlDTO> {
        
        let id:string , username:string;
       
        const isUserLoginDTO:boolean = !userPayLoad.hasOwnProperty('provider') ;
        
        if(isUserLoginDTO) {
        
            const foundUser:User = await this.userModel.findOne({username: userPayLoad.username}).lean();
        
            if(!foundUser) throw new UnauthorizedException(`User not registered`);
        
            const isPasswordMatch:boolean = await bcrypt.compare(userPayLoad['password'], foundUser.password);
        
            if(!isPasswordMatch) throw new UnauthorizedException(`Incorrect password`);
            
            username = foundUser['username'];
            id = foundUser['_id'].toString();
        }
        
        else{
            id = userPayLoad['_id'];
            username = userPayLoad.username;
        }
        
        const [privateKey, publicKey] = await Promise.all([
            randomBytes(64).toString('hex'),
            randomBytes(64).toString('hex')
        ]);
        
        const tokens:TokenPair =  await createTokenPair(
            {
                userId:id, username
            },  publicKey,privateKey
        ); 
        
        await this.keyTokenService.createToken({
            refreshToken:tokens.refreshToken,
            privateKey,publicKey,userId:id
        });
        
        const payload:UserLoginSuccessDTO = {
           user:{ 
            userId:id,
            userName:username
           },
           tokens
        };

        if(isUserLoginDTO) return new SuccessResponse({
            metadata:payload
        });

        return {
                    userId:id,
                    userName:username,
                    accessToken:tokens.accessToken,
                    refreshToken:tokens.refreshToken
        } as RedirectUrlDTO;
        
}

    
    async signUp(newUser:CreateUserDTO):Promise<SuccessResponse<UserCreateSuccessDTO>>{
        
        const [userNameExistDoc,userEmailExistDoc] : [User,User] =  await Promise.all([
            this.userModel.findOne({username: newUser.username}).lean() ,
            this.userModel.findOne({email: newUser.email}).lean(), 
        ]);
        
        if(userNameExistDoc!== null || userEmailExistDoc!== null) throw new ConflictException(`User already exists`);

        const passwordHash = await bcrypt.hash(newUser.password,10);
        
        await this.userModel.create({
                username: newUser.username,
                password: passwordHash,
                email: newUser.email,
                status:'active',
        });

        const userPayLoad:UserCreateSuccessDTO = {...newUser,status:'active'};

        return new SuccessResponse({
            message:"user created successfully",
            metadata:userPayLoad
        }); 
        
    }

    async resetPassword(resetPWD_Payload:ResetPasswordDTO):Promise<SuccessResponse>{
        
        const {userId,resetToken,password} = resetPWD_Payload;
        
        const decodedUser:DecodedUserDataFromToken = await this.resetTokenService.verifyResetToken(userId,resetToken);
        
        await Promise.all([
            this.resetTokenService.removeResetToken(userId),
            this.userModel.findByIdAndUpdate({_id:decodedUser['userId']},{password:await bcrypt.hash(password,10)})
        ]);
        
        return new SuccessResponse({message:"Password changed successfully"});
    }

    async logout (keyStore:KeyToken):Promise<SuccessResponse> {
        
        await this.keyTokenService.removeTokenById(keyStore['_id']);
        
        return new SuccessResponse({message: 'Logged out successfully'});
    }

   
}
