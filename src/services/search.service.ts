import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song, SongDocument } from 'src/schemas/songs.schemas';
import { SuccessResponse } from 'src/Types/successResponse';
import { ISearchService } from 'src/interfaces/ISearchService';


@Injectable()
export class SearchService implements ISearchService {
    constructor(@InjectModel(Song.name) private readonly songModel:  Model<Song> ){}
    
    async Search(searchText:string):Promise<SuccessResponse<Array<SongDocument>>>{
        const search:string = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        
        const regex:RegExp = new RegExp(search, 'gi');
        
        return new SuccessResponse({
            metadata:await this.songModel.find({
            $or:[
                {title:{$regex: regex}},
                {artist_name:{$regex: regex}},
                {album:{$regex: regex}},
            ]
            }).limit(12).lean()
        })
    }
}
