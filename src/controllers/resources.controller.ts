import { Controller ,Get, Param} from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';
import { Res,Req } from '@nestjs/common/decorators';
import { Response,Request } from 'express';
import { AllowUnauthorizedRequest } from 'src/auth/google/utils/excepts.guard';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourceService:ResourcesService){}

    @AllowUnauthorizedRequest()
    @Get('audio/:fileName')
    async getAudioFile(@Param('fileName') fileName:string,@Req() req:Request, @Res() res:Response):Promise<void>
    {
        return await this.resourceService.StreamAudioFile(req,res,fileName);
    }

}
