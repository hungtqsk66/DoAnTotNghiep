export class SuccessResponse<T=void>{

        statusCode:number = 200 ; 
        message:string = "Success";
        metadata?:T
        constructor(partial: Partial<SuccessResponse<T>>) {
            Object.assign(this, partial);
        }
} 