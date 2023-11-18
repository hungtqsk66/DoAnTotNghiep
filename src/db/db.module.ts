import { Module } from '@nestjs/common';
import { MongodbService } from './services/mongodb/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:User.name,
        schema: UserSchema
      }
  ])
]
  ,
  providers: [MongodbService],
  exports:[MongodbService]
})
export class DbModule {}
