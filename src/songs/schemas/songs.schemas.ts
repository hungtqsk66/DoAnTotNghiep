import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Album } from 'src/album/schemas/album.schemas';
import { Artist } from 'src/artist/schemas/artist.schemas';

export type SongDocument = HydratedDocument<Song>;

@Schema({collection:'Songs'})
export class Song {
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

    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:"Artists",default:[]})
    artist:Artist[]

    @Prop({default:""})
    album:string;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Albums",default:""})
    albumRef:Album;

    @Prop({default:null})
    year:number;

    @Prop({default:0})
    views:number

    @Prop({default:0})
    likes:number

    @Prop({default:0})
    dislikes:number
    
    @Prop({default:"default.jpg"})
    coverArt:string
    
    

}

export const SongSchema = SchemaFactory.createForClass(Song)