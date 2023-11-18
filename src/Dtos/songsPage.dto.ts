import { SongDocument } from "src/schemas/songs.schemas";

export class SongsPageDTO 
{
    page:number;
    songs:Array<SongDocument>;
}