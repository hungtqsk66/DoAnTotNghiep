import { Module } from '@nestjs/common';
import { SearchController } from './controller/search/search.controller';
import { SearchService } from './service/search/search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from 'src/songs/schemas/songs.schemas';


@Module({
  imports:[MongooseModule.forFeature([
    {
      name:Song.name,
      schema:SongSchema
    }
  ])],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
