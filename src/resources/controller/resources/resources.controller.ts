import { Controller ,Get, Param} from '@nestjs/common';
import { ResourcesService } from '../../services/resources/resources.service';
import { Post, Res } from '@nestjs/common/decorators';
import {Response} from 'express';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourceService:ResourcesService){}

    @Get()
    getData(){
        console.log('working');
        return {metaData:"Resources"};
    }

    @Get('audio/:fileName')
    getAudioFile(@Param('fileName') fileName:string, @Res() response:Response):void {
        return this.resourceService.sendAudioFile(response,fileName);
    }

}
