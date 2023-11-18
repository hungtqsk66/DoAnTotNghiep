import * as JWT from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import { KeyTokenService } from 'src/services/key-token.service';
import { KeyToken } from 'src/schemas/key-token.schema';
import {Injectable,NestMiddleware,UnauthorizedException } from '@nestjs/common';
import { UserJwtDTO } from 'src/Dtos/userJWT.dto';


enum KeyType {
  publicKey = 'publicKey',
  privateKey = 'privateKey'
}



@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(private readonly keyTokenService:KeyTokenService){}

 
 
// This function bind payloads to the request

  private bindRequest = (
    userId:string,verifyToken:string,
    keyType:KeyType,keyStore:KeyToken,
    request:Request,next:NextFunction
  ) => {

    const decodedUser:UserJwtDTO =  JWT.verify(verifyToken,keyStore[keyType]) as UserJwtDTO ;
    
    if(userId !== decodedUser?.userId) throw new UnauthorizedException(`Invalid user id`);
    
    if(request.headers['x-r-token'])
    {
      request['user'] = decodedUser;
      request['refreshToken'] = verifyToken;
    }
    request['keyStore'] = keyStore;
    return next()
  }
  
  async use(req: Request,res:Response, next: NextFunction) {
    
    const userId:string = req.headers['x-client-id'] as string ;
    
    if(!userId) throw new UnauthorizedException(`Invalid request`);
    const keyStore:KeyToken = await this.keyTokenService.findTokenByUserId(userId);
    
    //This is for refreshing tokens
    if(req.headers['x-r-token']){
      const refreshToken:string = req.headers['x-r-token'] as string;
      return  this.bindRequest(userId,refreshToken,KeyType.privateKey,keyStore,req,next);
    }
    
    //This is for other requests that need to interact with the user data
    const accessToken:string = req.headers['authorization'] as string;
    return this.bindRequest(userId,accessToken,KeyType.publicKey,keyStore,req,next);
  }
  
}
