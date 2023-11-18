import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { Song, SongDocument } from 'src/schemas/songs.schemas';
import { SuccessResponse } from 'src/Types/successResponse';
import { ISongService } from 'src/interfaces/ISongService';
import { SongsPageDTO } from 'src/Dtos/songsPage.dto';
import { SongDTO } from 'src/Dtos/song.dto';


@Injectable()
export class SongsService implements ISongService {
    
    constructor(@InjectModel(Song.name) private readonly songModel:Model<Song>){}
    
    async getSongById(id:string):Promise<SuccessResponse<SongDTO>> {
        
        const song:SongDocument = await this.songModel.findById(id).lean();
        
        if(!song) throw new NotFoundException(`Song not found`);

        const songDTO:SongDTO = {...song};
        
        return new SuccessResponse({metadata:songDTO});
    }

    async getSongsByPage(page:number):Promise<SuccessResponse<SongsPageDTO>> {
        
        if(page <= 0) throw new BadRequestException("page must be greater than 0");
        page = Math.floor(page);
        
        const pageSize = 12;
        
        const skip = (page - 1) * pageSize;
        
        const songsPage:SongsPageDTO = {
            page:page,
            songs:await this.songModel
                            .find()
                            .skip(skip)
                            .limit(pageSize)
                            .lean()
        }

        return new SuccessResponse({
            metadata:songsPage
        });

    }
}
