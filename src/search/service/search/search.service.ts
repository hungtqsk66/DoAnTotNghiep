import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from 'src/songs/schemas/songs.schemas';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';


@Injectable()
export class SearchService {
    constructor(@InjectModel(Song.name) private readonly songModel:  Model<Song> ){}
    async Search(searchText:string):Promise<SuccessResponse>{
        const search:string = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex:RegExp = new RegExp(search, 'gi');
        
        return new SuccessResponse({
            metadata:await this.songModel.find({
            $or:[
                {title:{$regex: regex}},
                {artist_name:{$regex: regex}},
                {album:{$regex: regex}},
            ]
            }).lean()
        })
    }
}
