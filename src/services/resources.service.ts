import * as fs from 'fs';
import { join } from 'path';
import { Stream } from 'stream';
import { Request,Response } from 'express';
import { Injectable, NotFoundException, Req, Res} from '@nestjs/common';

@Injectable()
export class ResourcesService {
    
    async sendAudioFile(@Req() req:Request,@Res() res:Response ,fileName: string):Promise<void>{
        
        const filePath = join(__dirname,`../../../../audio/${fileName}`);
        if(fs.existsSync(filePath)) {
            
            const 
            
                stat:fs.Stats = fs.statSync(filePath),
                
                fileSize:number = stat.size,
                
                range:string = req.headers.range ?? `bytes=0-`,
                
                parts = range.replace(/bytes=/, "").split("-"),
                
                start:number = parseInt(parts[0], 10),

                end:number = parts[1] ?parseInt(parts[1], 10) :fileSize - 1,
                
                chunksize:number = (end - start) + 1,
                
                file:Stream = fs.createReadStream(filePath, {start, end}),
                
                head:any = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg',
                };
            
            
            res.writeHead(206, head);
            
            file.pipe(res);
        }
        else throw new NotFoundException('File not found');
    }

}
