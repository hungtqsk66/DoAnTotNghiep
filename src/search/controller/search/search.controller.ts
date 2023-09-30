import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from 'src/search/service/search/search.service';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService){}
    @Get()
    async getData(@Query('keyword') keyword:string):Promise<SuccessResponse>{
        return await this.searchService.Search(keyword);
    }
}
