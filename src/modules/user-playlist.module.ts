import { Module } from '@nestjs/common';
import { UserPlaylistService } from '../services/user-playlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlaylist, UserPlaylistSchema } from 'src/schemas/user-playlist.schema';
import { Song, SongSchema } from 'src/schemas/songs.schemas';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:UserPlaylist.name,
        schema:UserPlaylistSchema
      }
  ])
],
  providers: [UserPlaylistService],
  exports:[UserPlaylistService]
})
export class UserPlaylistModule {}
