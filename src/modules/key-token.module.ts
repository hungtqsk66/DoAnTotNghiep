import { Module } from '@nestjs/common';
import { KeyToken, KeyTokenSchema } from '../schemas/key-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyTokenService } from '../services/key-token.service';
import { DbModule } from 'src/db/db.module';


@Module({
    imports:[
        MongooseModule.forFeature([{name:KeyToken.name,schema:KeyTokenSchema}]),
        DbModule
    ],
    providers:[KeyTokenService],
    exports:[KeyTokenService],
})
export class KeyTokenModule {}
