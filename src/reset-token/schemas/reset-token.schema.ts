import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type ResetTokenDocument = HydratedDocument<ResetToken>;

@Schema({collection:'Reset-Tokens'})
export class ResetToken{
    @Prop({required: true,type:mongoose.Schema.Types.ObjectId,ref:'Users'})
    user:User;

    @Prop({required: true})
    publicKey:string;

    @Prop({default:new Date()})
    createdAt:Date
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);




