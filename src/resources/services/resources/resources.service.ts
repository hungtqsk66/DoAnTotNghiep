import { Injectable,NotFoundException,Res} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

import { join } from 'path';

@Injectable()
export class ResourcesService {
    sendAudioFile(@Res() res:Response ,fileName: string){
        const filePath = join(__dirname,`../../../../audio/${fileName}`);
        if(fs.existsSync(filePath)) res.sendFile(filePath);
        else throw new NotFoundException('File not found');
    }

}
