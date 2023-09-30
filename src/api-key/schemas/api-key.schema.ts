import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ApiKeyDocument = HydratedDocument<ApiKey>;



@Schema({collection:'ApiKeys'})
export class ApiKey {
    @Prop({required:true})
    key:string;
    @Prop({required:true})
    status:boolean = true;

    @Prop({required:true})
    permissions:string[];

    @Prop({required:true,expires:'30d'})
    createdAt:Date = new Date();
    
    @Prop({required:true})
    description:string;

    @Prop({required:true})
    version:string = 'v1';
};

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);