import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({collection: 'Users'})
export class User{
    @Prop({required: true})
    username: string;

    @Prop({required: true,unique:true})
    email:string;

    @Prop({required:true,enum:['Local','Google','Facebook'],default:'Local'})
    provider:string;

    @Prop({default:""})
    password:string;

    @Prop({default:""})
    profile_picture:string;

    @Prop({required: true,enum: ['active', 'inactive'],default:'active'})
    status:string;

    @Prop({required: true,default:['User']})
    roles:string[]

    @Prop({required: true,default:true})
    verified:boolean ;
}

export const UserSchema = SchemaFactory.createForClass(User);