import { Module } from '@nestjs/common';
import { UserPlaylistService } from '../services/user-playlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlaylist, UserPlaylistSchema } from 'src/schemas/user-playlist.schema';
import { UserItemSchema, UserItems } from 'src/schemas/user-items.schema';


@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:UserPlaylist.name,
        schema:UserPlaylistSchema
      },
      {
        name:UserItems.name,
        schema: UserItemSchema
      }
  ])
],
  providers: [UserPlaylistService],
  exports:[UserPlaylistService]
})
export class UserPlaylistModule {}
