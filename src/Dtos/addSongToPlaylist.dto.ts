import { IsNotEmpty } from "class-validator";

export class AddSongToPlaylistDTO 
{
    @IsNotEmpty()
    songId:string;

    @IsNotEmpty()
    playListId:string;
}