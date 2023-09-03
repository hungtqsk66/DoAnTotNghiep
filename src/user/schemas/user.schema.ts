import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({collection: 'Users'})
export class User{
    @Prop({required: true})
    username: string;

    @Prop({required: true})
    email:string;

    @Prop({required: true})
    password:string;

    @Prop({required: true,enum: ['active', 'inactive']})
    status:string;

    @Prop({required: true,default:['Dev']})
    roles:string[]

    @Prop({required: true,default:true})
    verified:boolean ;
}

export const UserSchema = SchemaFactory.createForClass(User);