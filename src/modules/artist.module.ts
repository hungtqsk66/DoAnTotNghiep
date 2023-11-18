import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from '../schemas/artist.schemas';


@Module({
    imports:[
        MongooseModule.forFeature([
            {
                name:Artist.name,
                schema:ArtistSchema
            }
        ])
    ]
})
export class ArtistModule {}
