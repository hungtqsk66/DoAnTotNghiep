import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Song } from 'src/songs/schemas/songs.schemas';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({collection: 'Albums'})
export class Album {
    @Prop({required: true})
    name:string;

    @Prop({required: true,type:[mongoose.Schema.Types.ObjectId],ref:'Songs'})
    songs:Song[]

    @Prop({required: true,default:"default.jpg"})
    coverArt:string
}

export const AlbumSchema = SchemaFactory.createForClass(Album);