import { TokenPair } from "src/auth/middleware/verify-token/utils/token.handle";
import { UserJwtDTO } from "./userJWT.dto";

export class UserTokenDTO {
    user:UserJwtDTO;
    tokens:TokenPair;
}