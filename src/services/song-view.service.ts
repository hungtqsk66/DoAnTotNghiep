import {Request} from 'express';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UpdateViewDto } from 'src/Dtos/updateView.dto';
import { Song } from 'src/schemas/songs.schemas';
import { User_Item, User_Item_Document } from 'src/schemas/user-items.schema';
import { ISongViewsService } from 'src/interfaces/ISongViewsService';


@Injectable()
export class SongViewService implements ISongViewsService {
    
    constructor(
        @InjectModel(Song.name) private readonly songModel:Model<Song>,
        @InjectModel(User_Item.name) private readonly userItem:Model<User_Item>
    ) {}

    async updateSongViews(updateView:UpdateViewDto,req:Request):Promise<void>{
        
        const userId:string = req.headers['x-client-id'] as string;
        
        const song_id = updateView.songId;

        await this.songModel.findOneAndUpdate({_id:song_id},{$inc:{views:1}});

        const not_userId:boolean = (userId === null || userId === undefined || userId === '');
        
        if(not_userId) return ;

        const userItemRecord:User_Item_Document = await this.userItem.findById(userId).lean();
        
        if(! userItemRecord) {
            await this.userItem.create({
                _id:new mongoose.mongo.ObjectId(userId),
                records:[
                    {
                        song_id,
                        user_listen_counts:1
                    }
                ]
            });
            
            return ;
        }

        const records:{song_id:Object,user_listen_counts:number}[] = userItemRecord.records;

        const song_record = records.find((element)=>element.song_id.toString() === song_id);

        if(!song_record) records.push( 
            {
                song_id,
                user_listen_counts:1
            }
        );

        else song_record.user_listen_counts += 1;

        await this.userItem.findByIdAndUpdate(userId,{records});

    }
}
