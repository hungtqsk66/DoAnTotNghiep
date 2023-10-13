import { Module } from '@nestjs/common';
import { SongViewsController } from './controller/song-views/song-views.controller';
import { SongViewService } from './service/song-view/song-view.service';
import { Song, SongSchema } from 'src/songs/schemas/songs.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { User_Item, User_Item_Schema } from 'src/user/schemas/user-items.schemas';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Song.name,
        schema: SongSchema
      },
      {
        name:User_Item.name,
        schema:User_Item_Schema
      }
    ])
  ],
  controllers: [SongViewsController],
  providers: [SongViewService]
})
export class SongViewsModule {}
