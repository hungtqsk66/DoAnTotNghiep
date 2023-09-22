import { Controller ,Get, Param} from '@nestjs/common';
import { ResourcesService } from '../../services/resources/resources.service';
import { Res,Req } from '@nestjs/common/decorators';
import { Response,Request } from 'express';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourceService:ResourcesService){}

    @Get('audio/:fileName')
    // getAudioFile(@Param('fileName') fileName:string, @Res() reply:FastifyReply){
    //     return this.resourceService.sendAudioFile(reply,fileName);
    // }
    getAudioFile(@Param('fileName') fileName:string,@Req() req:Request, @Res() res:Response){
        return this.resourceService.sendAudioFile(req,res,fileName);
    }

}
