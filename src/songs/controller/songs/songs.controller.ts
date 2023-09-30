import { Controller,Param ,ParseIntPipe,Get} from '@nestjs/common';
import { SongsService } from 'src/songs/service/songs/songs.service';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';

@Controller('songs')
export class SongsController {
    constructor(private songService:SongsService){}

    @Get(':id')
    async getSongById(@Param('id') id:string):Promise<SuccessResponse>{
        return await this.songService.getSongById(id)
    }


    @Get('page/:page')
    async getSongsByPage(@Param('page',ParseIntPipe)page:number):Promise<SuccessResponse>{
        return await this.songService.getSongsByPage(page);
    }

}
