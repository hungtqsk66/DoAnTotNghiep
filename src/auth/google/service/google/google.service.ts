import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request , Response} from 'express';
import { User } from 'src/schemas/user.schema';
import { UserFromGoogleDTO } from 'src/Dtos/userFromGoogle.dto';
import { UserVerifiedDTO } from 'src/Dtos/verifiedUser.dto';
import { IGoogleAuthService } from '../../interfaces/IGoogleAuthService';




@Injectable()
export class GoogleService implements IGoogleAuthService {
    
    constructor( @InjectModel(User.name) private readonly userModel:Model<User>){}
    
    async googleLogin(req:Request,res:Response): Promise<UserVerifiedDTO>  {
        if (!req['user']) throw new UnauthorizedException('User not registered');
        
        const {email,firstName,lastName,picture} : UserFromGoogleDTO = req['user'] as UserFromGoogleDTO;
        const username:string =  `${firstName} ${lastName}`;
        const userInDB:User = await this.userModel.findOne({email}).lean();
        
        if(!userInDB){
            const newGoogleUser =  new this.userModel({
                username,
                email,
                provider:'Google',
                profile_picture:picture,
            });
            
            await newGoogleUser.save();
            const _id:string = newGoogleUser._id.toString();
            
            return {_id,username,provider:'Google'};
        }
        const provider : string = userInDB.provider;
        
        if(provider !== 'Google'){
            const errorMessage:string = 'Conflict user'; 
            res.redirect(`${process.env.CLIENT_REDIRECT_URL}/login?error=${errorMessage}`);
            throw new ConflictException(errorMessage);
            
        };
        
        return {_id:userInDB['_id'],username:userInDB['username'],provider:userInDB.provider}
        
    }
}

