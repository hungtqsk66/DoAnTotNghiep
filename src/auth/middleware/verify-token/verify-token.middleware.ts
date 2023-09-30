import * as JWT from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import { KeyTokenService } from 'src/key-token/service/key-token/key-token.service';
import { KeyToken } from 'src/key-token/schemas/key-token.schema';
import {Injectable,NestMiddleware,UnauthorizedException } from '@nestjs/common';


enum KeyType {
  publicKey = 'publicKey',
  privateKey = 'privateKey'
}

export interface UserJWTPayload extends JWT.JwtPayload{
  userId: string,
  username:string,
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

    const decodedUser:UserJWTPayload =  JWT.verify(verifyToken,keyStore[keyType]) as UserJWTPayload ;
    
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
    
    const userId:string = req.headers['x-client-id'].toString() ;
    
    if(!userId) throw new UnauthorizedException(`Invalid request`);
    const keyStore:KeyToken = await this.keyTokenService.findByUserId(userId);
    
    //This is for refreshing tokens
    if(req.headers['x-r-token']){
      const refreshToken:string = req.headers['x-r-token'].toString();
      return  this.bindRequest(userId,refreshToken,KeyType.privateKey,keyStore,req,next);
    }
    
    //This is for other requests that need to interact with the user data
    const accessToken:string = req.headers['authorization'].toString();
    return this.bindRequest(userId,accessToken,KeyType.publicKey,keyStore,req,next);
  }
  
}
