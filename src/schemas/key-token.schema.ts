import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';

export type KeyTokenDocument = HydratedDocument<KeyToken>;

@Schema({collection:'Keys'})
export class KeyToken{
    @Prop({required: true,type:mongoose.Schema.Types.ObjectId,ref:'Users'})
    user:User;

    @Prop({required: true})
    publicKey:string;

    @Prop({required: true})
    privateKey:string;

    @Prop({required: true})
    refreshToken:string;

    @Prop({required: true})
    refreshTokenUsed:string[]

}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);

