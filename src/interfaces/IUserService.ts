import { CreateUserDTO } from "src/Dtos/createUser.dto";
import { ResetPasswordDTO } from "src/Dtos/resetPassword.dto";
import { SuccessResponse } from "src/Types/successResponse";
import { UserLoginDTO } from "src/Dtos/userLogin.dto";
import { KeyToken } from "src/schemas/key-token.schema";
import { RedirectUrlDTO } from "src/Dtos/redirectURL.dto";
import { UserLoginSuccessDTO } from "src/Dtos/userLoginSuccess.dto";
import { UserCreateSuccessDTO } from "src/Dtos/userCreateSuccess.dto";
import { UserVerifiedDTO } from "src/Dtos/verifiedUser.dto";
import { UserJwtDTO } from "src/Dtos/userJWT.dto";
import { UserTokenDTO } from "src/Dtos/userToken.dto";


export interface IUserService {
    login (userPayLoad: UserLoginDTO | UserVerifiedDTO):Promise<SuccessResponse<UserLoginSuccessDTO> | RedirectUrlDTO>;
    signUp(newUser:CreateUserDTO):Promise<SuccessResponse<UserCreateSuccessDTO>>;
    logout (keyStore:KeyToken):Promise<SuccessResponse>
    resetPassword(resetPWD_Payload:ResetPasswordDTO):Promise<SuccessResponse>
}