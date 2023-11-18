import { Module } from '@nestjs/common';
import { SongsController } from '../controllers/songs.controller';
import { SongsService } from '../services/songs.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Song, SongSchema } from '../schemas/songs.schemas';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:Song.name,schema:SongSchema
    }])
  ],
  controllers: [SongsController],
  providers: [SongsService]
})
export class SongsModule {}
