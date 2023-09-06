import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from 'src/songs/schemas/songs.schemas';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';


@Injectable()
export class SongsService {
    constructor(@InjectModel(Song.name) private readonly songDocument:Model<Song>){}
    
    async getSongById(id:string):Promise<SuccessResponse> {
        return new SuccessResponse({metadata:await this.songDocument.findOne({_id:id}).lean()})
    }

    async getSongsByPage(page:number):Promise<SuccessResponse> {
        if(page <= 0) throw new BadRequestException("page must be greater than 0");
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        return new SuccessResponse({
            metadata:{
                page,
                songs:await this.songDocument
                    .find()
                    .skip(skip)
                    .limit(pageSize)
                    .lean()
            }
        })

    }
}
