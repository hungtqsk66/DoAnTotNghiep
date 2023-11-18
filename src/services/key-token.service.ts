import { ForbiddenException,Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeyToken, KeyTokenDocument } from 'src/schemas/key-token.schema';
import { TokenPair, createTokenPair } from '../auth/middleware/verify-token/utils/token.handle';
import { IKeyTokenService } from 'src/interfaces/IKeyTokenService';
import { MongodbService } from 'src/db/services/mongodb/mongodb.service';
import { UserTokenDTO } from 'src/Dtos/userToken.dto';
import { UserJwtDTO } from 'src/Dtos/userJWT.dto';

@Injectable()
export class KeyTokenService implements  IKeyTokenService {
    constructor(
        @InjectModel(KeyToken.name) private keyTokenModel:Model<KeyToken>,
        private readonly mongodbService:MongodbService
    ){}

    async findTokenByUserId(userId:string):Promise<KeyTokenDocument>
    {
        return this.keyTokenModel.findOne({user:userId}).lean();
    }

    async createToken({userId,publicKey,privateKey,refreshToken}):Promise<void>
    {
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

    async modifyToken(keyStore:KeyTokenDocument,user:UserJwtDTO,refreshToken:string):Promise<UserTokenDTO>{
        const {userId,username} = user;
        
        if(keyStore.refreshTokenUsed.includes(refreshToken)){
            await this.keyTokenModel.findOneAndDelete({user:userId});
            throw new ForbiddenException(`Something went wrong , please re login your account `);
        }
        
        if(keyStore.refreshToken !== refreshToken) throw new UnauthorizedException();
        
        if(!await this.mongodbService.findUserByUserName(username)) throw new NotFoundException(`User not found`);
        
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
        
        return {
            user:{
                userId,username
            },tokens
        };

    }
}
