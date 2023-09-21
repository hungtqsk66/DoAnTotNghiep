import * as JWT from 'jsonwebtoken';


export interface UserResetTokenInfo {
    userId:string,
    resetToken:string
}

export interface ResetTokenPayload extends JWT.JwtPayload{
    userId:string,
    email:string
}