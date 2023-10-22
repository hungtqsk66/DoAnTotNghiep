import * as fs from 'fs';
import { join } from 'path';
import { Stream } from 'stream';
import { Request,Response } from 'express';
import { Injectable, NotFoundException, Req, Res} from '@nestjs/common';

@Injectable()
export class ResourcesService {
    sendAudioFile(@Req() req:Request,@Res() res:Response ,fileName: string){
        
        const filePath = join(__dirname,`../../../../audio/${fileName}`);
        if(fs.existsSync(filePath)) {
            
            const 
            
            stat:fs.Stats = fs.statSync(filePath),
            
            fileSize:number = stat.size,
            
            range:string = req.headers.range ?? `bytes=0-`,
            parts = range.replace(/bytes=/, "").split("-"),
            
            chunksize:number = 1000 * 1024,
            
            start:number = parseInt(parts[0], 10),

            end:number = Math.min(start + chunksize, fileSize - 1),
            
            
            file:Stream = fs.createReadStream(filePath, {start, end}),
            
            head:any = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': end - start + 1,
                'Content-Type': 'audio/mpeg',
            };
            
            res.writeHead(206, head);
            
            file.pipe(res);
        }
        else throw new NotFoundException('File not found');
    }

}
