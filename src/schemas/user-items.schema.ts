import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';
import { Song } from './songs.schemas';

export type UserItemsDocument = HydratedDocument<UserItems>;


@Schema({collection: 'Users-Items'})
export class UserItems{
    @Prop({
        type:[
            {
                _id:false,
                song_id:{type:mongoose.Schema.Types.ObjectId,ref:Song.name},
                user_listen_counts:{ type:mongoose.Schema.Types.Number,required:true,default:0}
            }
        ]
        ,
        required: true,
        default:[],
        index:true,
    })
    records:{song_id:Object,user_listen_counts:number}[] ;
}

export const UserItemSchema = SchemaFactory.createForClass(UserItems);