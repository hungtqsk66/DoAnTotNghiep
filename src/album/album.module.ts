import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './schemas/album.schemas';


@Module({
    imports:[
    MongooseModule.forFeature([
    {
        name:Album.name,
        schema:AlbumSchema  
    }
])
    ]
})
export class AlbumModule {}
