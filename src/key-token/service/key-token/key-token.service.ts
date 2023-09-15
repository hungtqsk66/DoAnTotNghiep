import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeyToken } from 'src/key-token/schemas/key-token.schema';
import { UserService } from 'src/user/service/user/user.service';
import { TokenPair, createTokenPair } from '../../../auth/middleware/verify-token/utils/token.handle';
import { UserJWTPayload } from 'src/auth/middleware/verify-token/verify-token.middleware';

@Injectable()
export class KeyTokenService {
    constructor(
        @InjectModel(KeyToken.name) private keyTokenModel:Model<KeyToken>,
        @Inject(forwardRef(() => UserService))private readonly userService:UserService
    ){}

    async findByUserId(userId:string):Promise<KeyToken>{
        return this.keyTokenModel.findOne({user:userId}).lean();
    }

    async createToken({userId,publicKey,privateKey,refreshToken}):Promise<void>{
        const 
                filter = {user:userId}, 
                update = {
                    publicKey,privateKey,
                    refreshToken,refreshTokensUsed: []
                }, options = {upsert:true,new:true};

        await this.keyTokenModel.findOneAndUpdate(filter,update, options);
    }

    async removeTokenById(id:string):Promise<void>{
        await this.keyTokenModel.findOneAndDelete({_id:id});
    }

    async modifyToken(keyStore:KeyToken,user:UserJWTPayload,refreshToken:string):Promise<any>{
        const {userId,username} = user;
        
        if(keyStore.refreshTokenUsed.includes(refreshToken)){
            await this.keyTokenModel.findOneAndDelete({user:userId});
            throw new ForbiddenException(`Something went wrong , please re login your account `);
        }
        
        if(keyStore.refreshToken !== refreshToken) throw new UnauthorizedException();
        
        if(!await this.userService.findUserByUserName(username)) throw new NotFoundException(`User not found`);
        
        const tokens :TokenPair = await createTokenPair({userId,username},keyStore.publicKey,keyStore.privateKey);
        
        await this.keyTokenModel.findOneAndUpdate({
            user:userId
        },{
            $set:{
                refreshToken:tokens.refreshToken,
            },
            $push:{
                refreshTokenUsed:refreshToken
            }

        });
        
        return {user:{userId,username},tokens};

    }
}
