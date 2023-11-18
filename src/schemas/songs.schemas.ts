import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';
import  * as mongoose from 'mongoose';
import { Album } from 'src/schemas/album.schemas';
import { Artist } from 'src/schemas/artist.schemas';

type SongDocument = HydratedDocument<Song>;

@Schema({collection:'Songs'})
class Song  {
    @Prop({required:true})
    title:string;

    @Prop({required:true,unique:true})
    file_name:string;
    
    @Prop()
    duration:number;

    @Prop({default:""})
    genre:string;
    
    @Prop({default:""})
    artist_name:string;

    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:Artist.name,default:[]})
    artist:Object[]

    @Prop({default:""})
    album:string;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:Album.name})
    albumRef:Object;

    @Prop({default:null})
    year:number;

    @Prop({default:0})
    views:number
    
    @Prop()
    coverArt:string

}

const SongSchema = SchemaFactory.createForClass(Song);

export  {SongSchema , Song, SongDocument}