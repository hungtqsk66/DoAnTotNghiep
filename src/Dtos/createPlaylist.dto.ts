import { IsNotEmpty } from "class-validator";

export class CreatePlaylistDTO{
    @IsNotEmpty()
    playListName:string;
}