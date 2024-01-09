import { Request } from 'express';
import  mongoose,{ Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SuccessResponse } from 'src/Types/successResponse';
import { UserPlayListDTO } from 'src/Dtos/userPlaylist.dto';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IUserPlaylistService } from 'src/interfaces/IUserPlaylistService';
import { UserPlaylist, UserPlaylistDocument } from '../schemas/user-playlist.schema';
import { mapDocumentsIdToString } from 'src/utils/document_id.mapToString';
import { UserItems } from 'src/schemas/user-items.schema';



@Injectable()
export class UserPlaylistService implements IUserPlaylistService {

    constructor(
        @InjectModel(UserPlaylist.name) private readonly userPlaylistModel:Model<UserPlaylist>, 
        @InjectModel(UserItems.name) private readonly userItemsModel:Model<UserItems>, 
    ) {}
    
    
    async getUserRecentSongsPlaylists(req: Request): Promise<SuccessResponse<any>> 
    {
        
        const userId:string = req.headers['x-client-id'] as string;
        
        const {records} = await this.userItemsModel.findOne(
            {
                _id:new mongoose.Types.ObjectId(userId)
            }
        ).populate('records.song_id').lean();

        if(!records) throw new NotFoundException();

        return new SuccessResponse({
            message:"Success",
            metadata:records.map(s=>
                {
                    s.song_id['_id'] = s.song_id['_id'].toString();
                    return s.song_id
                })       
        });
      
    }
    
    async getUserPlaylists(userId: string): Promise<SuccessResponse<UserPlayListDTO>> 
    {
        
        const userPlaylist:UserPlaylistDocument = await this.userPlaylistModel.findOne(
            {
                user_id:new mongoose.Types.ObjectId(userId)
            }
        ).populate('playLists.songs').lean();
        
        if(!userPlaylist) throw new NotFoundException();

        const [...mappedPlaylists] = await Promise.all(
            userPlaylist.playLists.map(async doc=>(
            {
                ...doc,
                _id:doc._id.toString(),                           
                songs:await mapDocumentsIdToString(doc.songs)
            })
        )
    );
        const userPlaylistDTO:UserPlayListDTO = {
            _id:userPlaylist._id.toString(),
            user_id:userPlaylist.user_id.toString(),
            playLists:mappedPlaylists
        } 
        
        return new SuccessResponse({
            metadata:userPlaylistDTO
        });
    }

    async createPlaylist(playListName: string, req: Request): Promise<SuccessResponse> 
    {
        
        const userId:string = req.headers['x-client-id'] as string;

        const queryId:Object = new mongoose.Types.ObjectId(userId);
        
        await this.userPlaylistModel.findOneAndUpdate(
            {
                user_id:queryId
            },
            {
                $push:{
                    playLists:{
                        playListName,songs:[]
                    }
                }
            },
            {
                upsert: true
            }
        );
        
        return new SuccessResponse({
            statusCode:HttpStatus.CREATED,
            message:`Playlist : ${playListName}. Created successfully`
        });
    }
    
    
    async removePlaylist(playListId: string, req: Request): Promise<SuccessResponse> 
    {
        
        const userId:string = req.headers['x-client-id']as string;
        
        await this.userPlaylistModel.findOneAndUpdate(
        {
            user_id:new mongoose.Types.ObjectId(userId)
        },
        {
            $pull:{
                playLists:{
                    _id:new mongoose.Types.ObjectId(playListId)
                }
            }
        }
        );
        
        return new SuccessResponse({message:`Playlist : ${playListId}. Removed successfully`});
    }
    

    async addSongToPlaylist(playListId: string, songId: string, req: Request): Promise<SuccessResponse> 
    {
        
        const userId:string = req.headers['x-client-id'] as string;
        
        const userPlayList:UserPlaylistDocument = await this.userPlaylistModel.findOne({user_id:new mongoose.Types.ObjectId(userId)}).lean();
        
        if(!userPlayList) throw new NotFoundException(`User: ${userId} playlists not found`);

        const {playLists} = userPlayList; 

        const playList = playLists.find(pl => pl._id.toString() == playListId);

        if(!playList) throw new NotFoundException(`This playlist has'nt been created`);

        playList.songs.push(new mongoose.Types.ObjectId(songId));

        await this.userPlaylistModel.findOneAndUpdate({user_id:new mongoose.Types.ObjectId(userId)},{playLists});

        return new SuccessResponse({message:`Added song id: ${songId} to playlist : ${playList.playListName} successfully`});
    }



    async removeSongFromPlaylist(playListId: string, songId: string, req: Request): Promise<SuccessResponse> 
    {
        
        const userId:string = req.headers['x-client-id'] as string;
        
        const userPlayList:UserPlaylistDocument = await this.userPlaylistModel.findOne({user_id:new mongoose.Types.ObjectId(userId)}).lean();
        
        if(!userPlayList) throw new NotFoundException(`User: ${userId} playlists not found`);

        const {playLists} = userPlayList; 

        const playList = playLists.find(pl => pl._id.toString() == playListId);

        if(!playList) throw new NotFoundException(`This playlist has'nt been created`);
        
        playList.songs = playList.songs.filter(_id=>_id.toString() !== songId);
       
        await this.userPlaylistModel.findOneAndUpdate({user_id:new mongoose.Types.ObjectId(userId)},{playLists:playLists});

        return new SuccessResponse({message:`Removed song id: ${songId} to playlist : ${playList.playListName} successfully`});
    }

    

}