import { SuccessResponse } from "src/Types/successResponse";
import { SongDocument } from "src/schemas/songs.schemas";

export interface ISearchService 
{
    Search(searchText:string):Promise<SuccessResponse<Array<SongDocument>>>
}