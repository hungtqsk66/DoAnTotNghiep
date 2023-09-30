import { Module } from '@nestjs/common';
import { SongsController } from './controller/songs/songs.controller';
import { SongsService } from './service/songs/songs.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Song, SongSchema } from './schemas/songs.schemas';

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
