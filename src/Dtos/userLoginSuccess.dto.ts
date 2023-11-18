import { TokenPair } from "src/auth/middleware/verify-token/utils/token.handle";

export class UserLoginSuccessDTO 
{
    user:{ 
        userId:string,
        userName:string
    };
    tokens:TokenPair;
}