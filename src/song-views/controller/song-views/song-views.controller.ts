import { Controller, HttpCode, Post ,Body, Req} from '@nestjs/common';
import { UpdateViewDto } from 'src/song-views/dto/updateView.dto';
import { SongViewService } from '../../service/song-view/song-view.service';

@Controller('views')
export class SongViewsController {
    
    constructor(
        private readonly songViewService:SongViewService
    ){}

    @HttpCode(200)
    @Post('set')
    async handleSongView(@Body() updateView:UpdateViewDto ){
        await this.songViewService.updateSongViews(updateView)
    }
}
