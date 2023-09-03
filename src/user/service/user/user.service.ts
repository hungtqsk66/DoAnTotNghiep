import { ConflictException, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SuccessResponse } from 'src/user/dto/successResponse.dto';
import { UserLoginDTO } from 'src/user/dto/userLogin.dto';
import {randomBytes} from 'crypto';
import { TokenPair, createTokenPair } from 'src/auth/middleware/verify-token/utils/token.handle';
import { KeyTokenService } from 'src/key-token/service/key-token/key-token.service';
import { KeyToken } from 'src/key-token/schemas/key-token.schema';
import { UserJWTPayload } from 'src/auth/middleware/verify-token/verify-token.middleware';


@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel:Model<User>,
        @Inject(forwardRef(() => KeyTokenService)) private keyTokenService:KeyTokenService){}

    
    
    async login (userPayLoad:UserLoginDTO):Promise<SuccessResponse> {
        
        const foundUser:User = await this.userModel.findOne({username: userPayLoad.username}).lean();
        
        if(!foundUser) throw new UnauthorizedException(`User not registered`);
        
        const isPasswordMatch:boolean = await bcrypt.compare(userPayLoad.password, foundUser.password)
        
        if(!isPasswordMatch) throw new UnauthorizedException(`Incorrect password`);
        
        const [privateKey, publicKey] = await Promise.all([
            randomBytes(64).toString('hex'),
            randomBytes(64).toString('hex')
        ]);

        const tokens:TokenPair =  await createTokenPair(
            {
                userId:foundUser['_id'], username:userPayLoad.username
            },  publicKey,privateKey
        ); 
        
        await this.keyTokenService.createToken({
            refreshToken:tokens.refreshToken,
            privateKey,publicKey,userId:foundUser['_id']
        });

        
        return new SuccessResponse({
            metadata:{
                user:{ 
                    userId:foundUser['_id'].toString(),
                    userName:foundUser['username']
                },
                tokens
            }
        });
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

    async logout (keyStore:KeyToken):Promise<SuccessResponse> {
        await this.keyTokenService.removeTokenById(keyStore['_id']);
        return new SuccessResponse({message: 'Logged out successfully'});
    }

    async refreshToken(keyStore:KeyToken,user:UserJWTPayload,refreshToken:string):Promise<SuccessResponse> {
        return new SuccessResponse({ metadata: await this.keyTokenService.modifyToken(keyStore,user,refreshToken)});
    }

    async findUserByUserName(username:string):Promise<User> {
        return await this.userModel.findOne({username:username}).lean();
    }
}
