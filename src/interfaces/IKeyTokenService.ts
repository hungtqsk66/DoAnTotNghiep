import { UserJwtDTO } from "src/Dtos/userJWT.dto";
import { KeyTokenDocument } from "../schemas/key-token.schema";

export interface IKeyTokenService
{
    findTokenByUserId(userId:string):Promise<KeyTokenDocument>;
    createToken({userId,publicKey,privateKey,refreshToken}:any):Promise<void>
    removeTokenById(id:string):Promise<void>
    modifyToken(keyStore:KeyTokenDocument,user:UserJwtDTO,refreshToken:string):Promise<any>
}