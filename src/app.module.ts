import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { KeyTokenModule } from './key-token/key-token.module';
import { VerifyTokenMiddleware } from './auth/middleware/verify-token/verify-token.middleware';
import { UserController } from './user/controllers/user/user.controller';




@Module({
  imports: 
  [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/audioServerDev'), 
    UserModule,ApiKeyModule, KeyTokenModule
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
      }
    )
    .forRoutes(UserController)
  }
}
