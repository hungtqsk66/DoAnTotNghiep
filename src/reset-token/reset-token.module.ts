import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';
import { ResetTokenService } from './services/reset-token/reset-token.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:ResetToken.name,schema:ResetTokenSchema},
        ]),
        forwardRef(()=> UserModule)
    ],
    providers:[ResetTokenService]
    ,
    exports:[ResetTokenService]
})
export class ResetTokenModule {}
