import { Module } from '@nestjs/common';
import { SongViewsController } from './controller/song-views/song-views.controller';
import { SongViewService } from './service/song-view/song-view.service';
import { Song, SongSchema } from 'src/songs/schemas/songs.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Song.name,
        schema: SongSchema
      }])
  ],
  controllers: [SongViewsController],
  providers: [SongViewService]
})
export class SongViewsModule {}
