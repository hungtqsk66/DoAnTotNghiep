import { Controller,Param ,ParseIntPipe,Get} from '@nestjs/common';
import { SongsService } from 'src/songs/service/songs/songs.service';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';

@Controller('songs')
export class SongsController {
    constructor(private songService:SongsService){}

    @Get(':id')
    getSongById(@Param('id') id:string):Promise<SuccessResponse>{
        return this.songService.getSongById(id)
    }


    @Get('page/:page')
    getSongsByPage(@Param('page',ParseIntPipe)page:number):Promise<SuccessResponse>
    {
        return this.songService.getSongsByPage(page);
    }

}
