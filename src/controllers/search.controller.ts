import { Controller, Get, Query } from '@nestjs/common';
import { SuccessResponse } from 'src/Types/successResponse';
import { SearchService } from 'src/services/search.service';
import { SongDocument } from 'src/schemas/songs.schemas';


@Controller('search')
export class SearchController {
    
    constructor(private readonly searchService: SearchService){}
    
    @Get()
    async getData(@Query('keyword') keyword:string):Promise<SuccessResponse<Array<SongDocument>>>
    {
        return await this.searchService.Search(keyword);
    }
}
