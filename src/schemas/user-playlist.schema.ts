import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';
import { Song } from 'src/schemas/songs.schemas';


export type UserPlaylistDocument = HydratedDocument<UserPlaylist>;


@Schema({collection: 'Users-Playlists'})
export class UserPlaylist
{
   

    @Prop({type:mongoose.Schema.Types.ObjectId,required:true,index:true})
    user_id:Object;

    @Prop({type:[
        {
            playListName:{type:mongoose.Schema.Types.String,required:true},
            songs:[
                {
                    
                    type:mongoose.Schema.Types.ObjectId,ref:Song.name
                }
            ]
        }
    ]})
    playLists:Array<{_id:Object,playListName:string,songs:Object[]}>
}

export const UserPlaylistSchema = SchemaFactory.createForClass(UserPlaylist);
