import { UserVerifiedDTO } from "src/Dtos/verifiedUser.dto";
import { Request , Response} from 'express';

export interface IGoogleAuthService{
    googleLogin(req:Request,res:Response): Promise<UserVerifiedDTO>
}