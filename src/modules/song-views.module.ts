import { Module } from '@nestjs/common';
import { SongViewsController } from '../controllers/song-views.controller';
import { SongViewService } from '../services/song-view.service';
import { Song, SongSchema } from 'src/schemas/songs.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { User_Item, User_Item_Schema } from 'src/schemas/user-items.schema';

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
