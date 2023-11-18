import { UpdateViewDto } from "src/Dtos/updateView.dto";
import { Request } from "express";

export interface ISongViewsService{
    updateSongViews(updateView:UpdateViewDto,req:Request):Promise<void>
}