import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request , Response} from 'express';
import { User_GooglePayload } from '../../utils/google.strategy';
import { User } from 'src/user/schemas/user.schema';

export interface UserFromGoogle {
    _id:string;
    username:string;
    provider:string;
}

@Injectable()
export class GoogleService {
    constructor( @InjectModel(User.name) private readonly userModel:Model<User>){}
    
    async googleLogin(req:Request,res:Response): Promise<UserFromGoogle>  {
        if (!req['user']) throw new UnauthorizedException('User not registered');
        
        const {email,firstName,lastName,picture} : {email:string,firstName:string,lastName:string,picture?:string} = req['user'] as User_GooglePayload;
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
        const {provider} : {provider:string} = userInDB;
        
        if(provider !== 'Google'){
            const errorMessage:string = 'Conflict user'; 
            res.redirect(`${process.env.CLIENT_REDIRECT_URL}/login/error?message=${errorMessage}`);
            throw new ConflictException(errorMessage);
            
        };
        
        return {_id:userInDB['_id'],username:userInDB['username'],provider:userInDB.provider}
        
    }
}

