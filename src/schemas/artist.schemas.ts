import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';


export type ArtistDocument = HydratedDocument<Artist>;

@Schema({collection: 'Artists'})
export class Artist {
    
    @Prop({required: true})
    artistName:string;

    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:'Songs',default:[]})
    featuredSongs:Object[]

    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:'Songs',default:[]})
    singles:Object[]

    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:'Albums',default:[]})
    albums:Object[]

    @Prop({required:true,default:"default.jpg"})
    coverArt:string
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
