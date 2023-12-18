import {Request} from 'express';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UpdateViewDto } from 'src/Dtos/updateView.dto';
import { Song } from 'src/schemas/songs.schemas';
import { UserItems, UserItemsDocument } from 'src/schemas/user-items.schema';
import { ISongViewsService } from 'src/interfaces/ISongViewsService';


@Injectable()
export class SongViewService implements ISongViewsService {
    
    constructor(
        @InjectModel(Song.name) private readonly songModel:Model<Song>,
        @InjectModel(UserItems.name) private readonly userItem:Model<UserItems>
    ) {}

    async updateSongViews(updateView:UpdateViewDto,req:Request):Promise<void>
    {
        
        const userId:string = req.headers['x-client-id'] as string;
        
        const song_id = updateView.songId;

        await this.songModel.findOneAndUpdate({_id:song_id},{$inc:{views:1}});

        const no_userId:boolean = (userId === null || userId === undefined || userId === '');
        
        if(!no_userId) await this.updateUserSongViews(userId,song_id);
    }

    private async updateUserSongViews(userId:string,song_id:string):Promise<void>
    {
        const userItemRecord:UserItemsDocument = await this.userItem.findById(userId).lean();
        
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

        const index:number = records.findIndex((element)=>element.song_id.toString() === song_id);

        if(index < 0) records.unshift( 
            {
                song_id,
                user_listen_counts:1
            }
        );

        else 
        {
            records[index].user_listen_counts += 1;
            records.unshift(records.splice(index, 1)[0]);
        }
        
        if(records.length > 50) records.pop();
        
        await this.userItem.findByIdAndUpdate(userId,{records});
    }
}
