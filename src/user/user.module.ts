import {  Module, forwardRef} from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './service/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './schemas/user.schema';
import { KeyToken,KeyTokenSchema } from 'src/key-token/schemas/key-token.schema';
import { KeyTokenModule } from 'src/key-token/key-token.module';

@Module({
  imports:[
    MongooseModule.forFeature([
    {
      name:User.name,
      schema: UserSchema
    },
    {
      name:KeyToken.name,
      schema:KeyTokenSchema
    }
  ]),forwardRef(() => KeyTokenModule)  
],
  controllers: [UserController],
  providers:[UserService],
  exports: [UserService],
})
export class UserModule  {}
