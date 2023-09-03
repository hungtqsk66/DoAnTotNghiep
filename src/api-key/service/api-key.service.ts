import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiKey } from '../schemas/api-key.schema';
import { Model } from 'mongoose';


@Injectable()
export class ApiKeyService {
    constructor(@InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKey>) {}
        async findById(key:string):Promise<ApiKey | null>{
        return this.apiKeyModel.findOne({key,status:true}).lean();
    }        
}
