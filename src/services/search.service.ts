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
        
        return new SuccessResponse({
            metadata:await this.songModel
                    .find({$text:{$search:searchText}}, {score: {$meta: 'textScore'}})
                    .sort({score: {$meta: 'textScore'}})
                    .limit(12)
                    .lean()
                    
        })
    }
}
