import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from '../schemas/album.schemas';
import { Song, SongSchema } from 'src/schemas/songs.schemas';


@Module({
    imports:[
    MongooseModule.forFeature([
    {
        name:Song.name,
        schema:SongSchema
    }
    ,
    {
        name:Album.name,
        schema:AlbumSchema  
    }
])
    ]
})
export class AlbumModule {}
