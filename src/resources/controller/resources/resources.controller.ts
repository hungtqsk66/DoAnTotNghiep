import { Controller ,Get, Param} from '@nestjs/common';
import { ResourcesService } from '../../services/resources/resources.service';
import { Res } from '@nestjs/common/decorators';
import { Response } from 'express';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourceService:ResourcesService){}

    @Get('audio/:fileName')
    // getAudioFile(@Param('fileName') fileName:string, @Res() reply:FastifyReply){
    //     return this.resourceService.sendAudioFile(reply,fileName);
    // }
    getAudioFile(@Param('fileName') fileName:string, @Res() res:Response){
        return this.resourceService.sendAudioFile(res,fileName);
    }

}
