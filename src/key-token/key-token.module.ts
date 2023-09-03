import { Module, forwardRef } from '@nestjs/common';
import { KeyToken, KeyTokenSchema } from './schemas/key-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyTokenService } from './service/key-token/key-token.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        
        MongooseModule.forFeature([{name:KeyToken.name,schema:KeyTokenSchema}]),
        forwardRef(() => UserModule)
    ],
    providers:[KeyTokenService],
    exports:[KeyTokenService],
})
export class KeyTokenModule {}
