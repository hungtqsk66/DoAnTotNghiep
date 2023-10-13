import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { UserModule } from './user/user.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { KeyTokenModule } from './key-token/key-token.module';
import { VerifyTokenMiddleware } from './auth/middleware/verify-token/verify-token.middleware';
import { UserController } from './user/controllers/user/user.controller'; 
import { ResourcesModule } from './resources/resources.module';
import { SongsModule } from './songs/songs.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { SearchModule } from './search/search.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ResetTokenModule } from './reset-token/reset-token.module';
import { SongViewsModule } from './song-views/song-views.module';
import { SongViewsController } from './song-views/controller/song-views/song-views.controller';





@Module({
  imports: 
  [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/audioServerDev'),
    RedisModule.forRoot({
      config: { 
        url: 'redis://localhost:6379',
      },
    }),
    UserModule,ApiKeyModule, KeyTokenModule,
    ResourcesModule,
    SongsModule,
    ArtistModule,
    AlbumModule,
    SearchModule,
    MailerModule.forRoot({
      transport: {
        host: 'in-v3.mailjet.com',
        port: 465,
        auth: {
          user: "09fcc6c44d2f55de47a6c199a7feb5ec",
          pass: "1ac7713742062fdace7226cf272defca",
        },
      },
      defaults: {
        from: '"No Reply" <k26.audio@gmail.com>',
      },
      preview: true
    }),
    ResetTokenModule,
    SongViewsModule

],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer){
    consumer
    .apply(VerifyTokenMiddleware)
    .exclude(
      {
        path:'/user/login',
        method:RequestMethod.POST
      },
      {
        path:'/user/signup',
        method:RequestMethod.POST
      },
      {
        path:'/user/verifyChangePassword',
        method:RequestMethod.POST
      },
      {
        path:'/user/changePassword',
        method:RequestMethod.POST
      },
      {
        path:'/user/auth/(.*)',
        method:RequestMethod.GET
      }
    )
    .forRoutes(UserController)
  }
}
