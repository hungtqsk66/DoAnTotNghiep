import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';

export type User_Item_Document = HydratedDocument<User_Item>;


@Schema({collection: 'Users-Items'})
export class User_Item{
    @Prop({
        type:[
            {
                _id:false,
                song_id:{type:mongoose.Schema.Types.ObjectId},
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

export const User_Item_Schema = SchemaFactory.createForClass(User_Item);