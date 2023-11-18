import {  Module, forwardRef} from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from '../schemas/user.schema';
import { KeyToken,KeyTokenSchema } from 'src/schemas/key-token.schema';
import { KeyTokenModule } from 'src/modules/key-token.module';
import { MailService } from 'src/services/mail.service';
import { MailModule } from 'src/modules/mail.module';
import { GoogleService } from 'src/auth/google/service/google/google.service';
import { GoogleStrategy } from 'src/auth/google/utils/google.strategy';
import { AuthModule } from 'src/modules/auth.module';
import { ResetTokenModule } from 'src/modules/reset-token.module';
import { UserPlaylistModule } from 'src/modules/user-playlist.module';
import { UserPlaylistService } from 'src/services/user-playlist.service';
import { UserPlaylist, UserPlaylistSchema } from '../schemas/user-playlist.schema';
import { KeyTokenService } from 'src/services/key-token.service';
import { DbModule } from 'src/db/db.module';

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
    },
    {
      name:UserPlaylist.name,
      schema:UserPlaylistSchema
    }
  ])
  ,KeyTokenModule
  ,ResetTokenModule
  ,MailModule,AuthModule,
  UserPlaylistModule,
  DbModule  
],
  controllers: [UserController],
  providers:[
    UserService,
    MailService,
    GoogleService,
    GoogleStrategy,
    UserPlaylistService,
    KeyTokenService
  ],
  exports: [UserService],
})
export class UserModule  {}
