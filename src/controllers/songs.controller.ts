import { Controller,Param ,ParseIntPipe,Get} from '@nestjs/common';
import { SongsService } from 'src/services/songs.service';
import { SuccessResponse } from 'src/Types/successResponse';
import { SongsPageDTO } from 'src/Dtos/songsPage.dto';
import { SongDTO } from 'src/Dtos/song.dto';


@Controller('songs')
export class SongsController {
    constructor(private songService:SongsService){}

    @Get(':id')
    async getSongById(@Param('id') id:string):Promise<SuccessResponse<SongDTO>>
    {
        return await this.songService.getSongById(id); 
    }


    @Get('page/:page')
    async getSongsByPage(@Param('page',ParseIntPipe)page:number):Promise<SuccessResponse<SongsPageDTO>>
    {
        return await this.songService.getSongsByPage(page);
    }

}
