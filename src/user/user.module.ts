import {  Module, forwardRef} from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './service/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './schemas/user.schema';
import { KeyToken,KeyTokenSchema } from 'src/key-token/schemas/key-token.schema';
import { KeyTokenModule } from 'src/key-token/key-token.module';
import { MailService } from 'src/mail/service/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { GoogleService } from 'src/auth/google/service/google/google.service';
import { GoogleStrategy } from 'src/auth/google/utils/google.strategy';
import { AuthModule } from 'src/auth/auth.module';

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
  ])
  ,forwardRef(() => KeyTokenModule)
  ,MailModule,AuthModule  
],
  controllers: [UserController],
  providers:[UserService,MailService,GoogleService,GoogleStrategy],
  exports: [UserService],
})
export class UserModule  {}
