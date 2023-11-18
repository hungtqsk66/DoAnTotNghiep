import { SongDTO } from "src/Dtos/song.dto";
import { SongsPageDTO } from "src/Dtos/songsPage.dto";
import { SuccessResponse } from "src/Types/successResponse";
import { SongDocument } from "src/schemas/songs.schemas";


export interface ISongService {
    getSongById(id:string):Promise<SuccessResponse<SongDTO>>;
    getSongsByPage(page:number):Promise<SuccessResponse<SongsPageDTO>>;
}