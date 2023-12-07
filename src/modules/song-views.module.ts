import { Module } from '@nestjs/common';
import { SongViewsController } from '../controllers/song-views.controller';
import { SongViewService } from '../services/song-view.service';
import { Song, SongSchema } from 'src/schemas/songs.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserItems, UserItemSchema } from 'src/schemas/user-items.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Song.name,
        schema: SongSchema
      },
      {
        name:UserItems.name,
        schema:UserItemSchema
      }
    ])
  ],
  controllers: [SongViewsController],
  providers: [SongViewService]
})
export class SongViewsModule {}
