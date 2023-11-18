import { IsNotEmpty } from "class-validator";


export class UpdateViewDto {
    @IsNotEmpty()
    songId:string;
}