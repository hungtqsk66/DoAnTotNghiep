import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { GoogleService } from './google/service/google/google.service';

@Module({
    imports:[
        MongooseModule.forFeature([
        {
            name:User.name,
            schema: UserSchema
        }
    ]),
    AuthModule
],
    providers:[GoogleService],
    exports:[
        GoogleService
    ]
})
export class AuthModule {}
