import { Injectable } from '@nestjs/common';
import { IMongodbService } from '../../interfaces/IMongodbService';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class MongodbService implements IMongodbService {
    
    
    constructor( @InjectModel(User.name) private readonly userModel:Model<User>) {}

    async findUserByUserName(username: string, option?: string): Promise<User> {
        return await this.userModel.findOne({username:username},option).lean();
    }
    
    async findUserByEmail(email: string, option?: string): Promise<User> {
        return await this.userModel.findOne({email:email},option).lean();
    }
    
}
