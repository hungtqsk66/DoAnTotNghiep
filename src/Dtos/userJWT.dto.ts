import * as JWT from 'jsonwebtoken';

export class UserJwtDTO implements JWT.JwtPayload{
    userId: string;
    username:string;
  }