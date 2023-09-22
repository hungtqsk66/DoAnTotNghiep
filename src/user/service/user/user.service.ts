import { ConflictException, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';
import { UserLoginDTO } from 'src/user/dto/userLogin.dto';
import {randomBytes} from 'crypto';
import { TokenPair, createTokenPair } from 'src/auth/middleware/verify-token/utils/token.handle';
import { KeyTokenService } from 'src/key-token/service/key-token/key-token.service';
import { KeyToken } from 'src/key-token/schemas/key-token.schema';
import { UserJWTPayload } from 'src/auth/middleware/verify-token/verify-token.middleware';
import { ResetPasswordDTO } from 'src/user/dto/resetPassword.dto';
import { ResetTokenService } from 'src/reset-token/services/reset-token/reset-token.service';
import { validate } from 'class-validator';
import { ResetTokenPayload } from 'src/reset-token/utils/reset-token.payload';
import { RedirectURLObj } from 'src/user/utils/Types/redirectURL.type';
import { UserFromGoogle } from 'src/auth/google/utils/types/user.google.type';


@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel:Model<User>,
        @Inject(forwardRef(() => KeyTokenService)) private keyTokenService:KeyTokenService,
        @Inject(forwardRef(() => ResetTokenService)) private resetTokenService:ResetTokenService
        ){}
    
    
    async login (userPayLoad: UserLoginDTO | UserFromGoogle):Promise<SuccessResponse | RedirectURLObj> {
        
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
        


        if(isUserLoginDTO) return new SuccessResponse({
            metadata:{
                user:{ 
                    userId:id,
                    userName:username
                },
                tokens
            }
        });

        return {userId:id,accessToken:tokens.accessToken,refreshToken:tokens.refreshToken};
        
}

    
    async signUp(userPayLoad:CreateUserDTO):Promise<SuccessResponse>{
        
        const [userNameExistDoc,emailExistDoc] : [User,User] =  await Promise.all([
            this.userModel.findOne({username: userPayLoad.username}).lean() ,
            this.userModel.findOne({email: userPayLoad.email}).lean(), 
        ]);
        
        if(userNameExistDoc!== null || emailExistDoc!== null) throw new ConflictException(`User already exists`);

        const passwordHash = await bcrypt.hash(userPayLoad.password,10);
        
        await this.userModel.create({
            username: userPayLoad.username,
            password: passwordHash,
            email: userPayLoad.email,
            status:'active',
        });

        return new SuccessResponse({
            message:"user created successfully",
            metadata:userPayLoad
        }); 
        
    }

    async resetPassword(resetPWD_Payload:ResetPasswordDTO){
        
        const {userId,resetToken,password} = resetPWD_Payload;
        
        const decodedUser:ResetTokenPayload = await this.resetTokenService.verifyResetToken(userId,resetToken);
        
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

    async refreshToken(keyStore:KeyToken,user:UserJWTPayload,refreshToken:string):Promise<SuccessResponse> {
        return new SuccessResponse({ metadata: await this.keyTokenService.modifyToken(keyStore,user,refreshToken)});
    }

    async findUserByUserName(username:string,option:string=null):Promise<User> {
        return await this.userModel.findOne({username:username},option).lean();
    }

    async findUserByEmail(email:string,option:string=null):Promise<User>{
        return await this.userModel.findOne({email:email},option).lean();
    }


}
