import { Injectable,NotFoundException,Res} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class ResourcesService {
    sendAudioFile(@Res() response : Response ,fileName: string){
        const filePath = join(__dirname,`../../../../audio/${fileName}`);

        if(fs.existsSync(filePath)) {
            const file = createReadStream(filePath);
            file.pipe(response);
        }
        else throw new NotFoundException('File not found');
        
    }

}
