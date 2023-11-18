import * as crypto from 'crypto'
import * as JWT from 'jsonwebtoken';
import { User } from 'src/schemas/user.schema';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, NotFoundException, ConflictException,BadRequestException } from '@nestjs/common';
import { IResetTokenService } from 'src/interfaces/IResetTokenService';
import { MongodbService } from 'src/db/services/mongodb/mongodb.service';
import { DecodedUserDataFromToken } from 'src/Types/decodedUser.type';
import { UserResetToken } from 'src/Types/userResetToken.type';


@Injectable()
export class ResetTokenService implements IResetTokenService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
        private readonly mongodbService:MongodbService
    ){}
    
    
    async generateResetToken(userEmail:string):Promise<UserResetToken>{
        
        const userDoc:User = await this.mongodbService.findUserByEmail(userEmail,'_id email provider');
        
        if(!userDoc) throw new NotFoundException(`User's email not found`);
        
        if(userDoc.provider !== 'Local') throw new ConflictException(`User's account not registered locally`);
        
        if(await this.redis.exists(userDoc['id'].toString())!== 0) throw new BadRequestException(`Pls verify your account first`);

        const {privateKey ,publicKey} = crypto.generateKeyPairSync("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            }
        });
        const isOk:string | null = await this.redis.set(userDoc['_id'].toString(),publicKey,'EX',900,'NX');
        
        if(isOk !== 'OK') throw new BadRequestException();
    
        
        const resetToken:string = JWT.sign(
            {
                userId:userDoc['_id'],
                email:userDoc.email
            },
            privateKey,
            {
                algorithm: "RS256",
                expiresIn:900
            }
            );
        
        
        return {userId:userDoc['_id'],resetToken};
    }

    async verifyResetToken(userId:string,resetToken:string) :Promise<DecodedUserDataFromToken>{
        
        const publicKey:string | null = await this.redis.get(userId);
        
        const decodedUser:DecodedUserDataFromToken = JWT.verify(resetToken,publicKey) as DecodedUserDataFromToken;
        
        if(decodedUser.userId !== userId) throw new ConflictException('Something wrong with reset token');
        
        return decodedUser;
    }

    async removeResetToken(userId:string):Promise<void>{
        await this.redis.del(userId);
    }
}
