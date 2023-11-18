import { Module } from '@nestjs/common';
import { SearchController } from '../controllers/search.controller';
import { SearchService } from '../services/search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from 'src/schemas/songs.schemas';


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
