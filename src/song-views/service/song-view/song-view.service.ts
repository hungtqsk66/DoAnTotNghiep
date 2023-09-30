import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateViewDto } from 'src/song-views/dto/updateView.dto';
import { Song } from 'src/songs/schemas/songs.schemas';


@Injectable()
export class SongViewService {
    constructor(
        @InjectModel(Song.name) private readonly songModel:Model<Song>
    ) {}

    async updateSongViews(updateView:UpdateViewDto){
        await this.songModel.findOneAndUpdate({_id:updateView.songId},{$inc:{views:1}});
    }
}
