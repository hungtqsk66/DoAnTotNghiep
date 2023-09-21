import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResetToken } from 'src/reset-token/schemas/reset-token.schema';
import * as crypto from 'crypto'
import * as JWT from 'jsonwebtoken';
import { UserService } from 'src/user/service/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { ResetTokenPayload, UserResetTokenInfo } from 'src/reset-token/utils/reset-token.payload';



@Injectable()
export class ResetTokenService {
    constructor(
        @InjectModel(ResetToken.name) private resetTokenModel:Model<ResetToken>,
        @Inject(forwardRef(() => UserService ))private readonly userService:UserService
    ){}
    
    
    async generateResetToken(userEmail:string):Promise<UserResetTokenInfo>{
        
        const userDoc:User = await this.userService.findUserByEmail(userEmail,'_id email provider');
        
        if(!userDoc) throw new NotFoundException(`User's email not found`);
        
        if(await this.resetTokenModel.findOne({user:userDoc['_id']}).lean()) throw new ConflictException('Token already generated');
        
        if(userDoc.provider!== 'Local') throw new ConflictException(`User's account not registered locally`);
        
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
        
        await this.resetTokenModel.create({user:userDoc['_id'],publicKey});
        
        return {userId:userDoc['_id'],resetToken};
    }

    async verifyResetToken(userId:string,resetToken:string) :Promise<ResetTokenPayload>{
        const resetTokenDoc:ResetToken = await this.resetTokenModel.findOne({user:userId}).lean();
        
        if(!resetTokenDoc) throw new NotFoundException('Reset token expired or not exist');
        
        const {publicKey} = resetTokenDoc;
        
        const decodedUser:ResetTokenPayload = JWT.verify(resetToken,publicKey) as ResetTokenPayload;
        
        if(decodedUser.userId !== resetTokenDoc.user.toString() || decodedUser.userId !== userId) throw new ConflictException('Something wrong with reset token');
        
        return decodedUser;
    }

    async removeResetToken(userId:string):Promise<void>{
        await this.resetTokenModel.findOneAndDelete({user:userId});
    }
}
