import { Injectable, NotFoundException, Req, Res, BadRequestException } from '@nestjs/common';
import { Request,Response } from 'express';
import * as fs from 'fs';

import { join } from 'path';

@Injectable()
export class ResourcesService {
    sendAudioFile(@Req() req:Request,@Res() res:Response ,fileName: string){
        
        const filePath = join(__dirname,`../../../../audio/${fileName}`);
        if(fs.existsSync(filePath)) {
            if(req.headers.range){
                const stat = fs.statSync(filePath)
            const fileSize = stat.size
            const range = req.headers.range
            const parts = range.replace(/bytes=/, "").split("-");
            
            const start = parseInt(parts[0], 10)
            /*in some cases end may not exists, if its
            not exists make it end of file*/
            const end = parts[1] ?parseInt(parts[1], 10) :fileSize - 1
             
            //chunk size is what the part of video we are sending.
            const chunksize = (end - start) + 1
            /*we can provide offset values as options to
           the fs.createReadStream to read part of content*/
            const file = fs.createReadStream(filePath, {start, end})
             
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
            }
            /*we should set status code as 206 which is
                    for partial content*/
            // because video is continuously fetched part by part
            res.writeHead(206, head);
            file.pipe(res);
        }    
            else res.sendFile(filePath);
        }
        else throw new NotFoundException('File not found');
    }

}
