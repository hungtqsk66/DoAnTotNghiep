import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';



export type AlbumDocument = HydratedDocument<Album>;

@Schema({collection: 'Albums'})
export class Album {
    @Prop({required: true})
    name:string;

    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:'Songs',required: true})
    songs:Object[]

    @Prop({required: true,default:"default.jpg"})
    coverArt:string
}

export const AlbumSchema = SchemaFactory.createForClass(Album);