import {Request} from 'express';
import { Controller, HttpCode, Post ,Body, Req} from '@nestjs/common';
import { UpdateViewDto } from 'src/Dtos/updateView.dto';
import { SongViewService } from '../services/song-view.service';

@Controller('views')
export class SongViewsController {
    
    constructor(
        private readonly songViewService:SongViewService
    ){}

    @HttpCode(200)
    @Post('set')
    async handleSongView(@Body() updateView:UpdateViewDto,@Req() req:Request ){
        await this.songViewService.updateSongViews(updateView,req);
    }
}
