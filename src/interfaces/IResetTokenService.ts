import { DecodedUserDataFromToken } from "src/Types/decodedUser.type";
import { UserResetToken } from "src/Types/userResetToken.type";


export interface IResetTokenService {
    generateResetToken(userEmail:string):Promise<UserResetToken>;
    verifyResetToken(userId:string,resetToken:string) :Promise<DecodedUserDataFromToken>
    removeResetToken(userId:string):Promise<void>
}