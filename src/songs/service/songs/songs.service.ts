import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Song, SongDocument } from 'src/songs/schemas/songs.schemas';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';


@Injectable()
export class SongsService {
    constructor(@InjectModel(Song.name) private readonly songDocument:Model<Song>){}
    
    async getSongById(id:string):Promise<SuccessResponse> {
        
        const song:SongDocument = await this.songDocument.findOne({_id:id}).lean()
        
        if(!song) throw new NotFoundException(`Song not found`);
        
        return new SuccessResponse({metadata:song})
    }

    async getSongsByPage(page:number):Promise<SuccessResponse> {
        
        if(page <= 0) throw new BadRequestException("page must be greater than 0");
        
        const pageSize = 12;
        
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
