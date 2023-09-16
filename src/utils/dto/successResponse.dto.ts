export class SuccessResponse{

        statusCode:number = 200 ; 
        message:string = "Success";
        metadata:object = {}
        constructor(partial: Partial<SuccessResponse>) {
            Object.assign(this, partial);
        }
} 