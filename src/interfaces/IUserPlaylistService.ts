import { Request } from "express"
import { UserPlayListDTO } from "src/Dtos/userPlaylist.dto";
import { SuccessResponse } from "src/Types/successResponse"


export interface IUserPlaylistService {
    createPlaylist(playListName:string,req:Request):Promise<SuccessResponse>;
    removePlaylist(playListId:string,req:Request):Promise<SuccessResponse>;
    addSongToPlaylist(playListId:string,songId:string,req:Request):Promise<SuccessResponse>;
    removeSongFromPlaylist(playListId:string,songId:string,req:Request):Promise<SuccessResponse>;
    getUserPlaylists(userId:string):Promise<SuccessResponse<UserPlayListDTO>>
    getUserRecentSongsPlaylists(req:Request):Promise<SuccessResponse<any>>
}