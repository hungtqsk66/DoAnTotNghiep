import { User } from "src/schemas/user.schema";

export interface IMongodbService {
    findUserByUserName(username:string,option?:string):Promise<User>;
    findUserByEmail(email:string,option?:string):Promise<User>;
}