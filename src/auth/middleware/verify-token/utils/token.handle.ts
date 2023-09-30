import * as JWT from 'jsonwebtoken';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}


export const createTokenPair = async (payload:any,publicKey:string,privateKey:string ):Promise<TokenPair> =>{
    
    const [accessToken, refreshToken] = await Promise.all([
        JWT.sign(payload,publicKey,{
            expiresIn: '7 days'
        }),
        JWT.sign(payload,privateKey,{
            expiresIn: '30 days'
        })
    ]);

    return {accessToken,refreshToken}
}