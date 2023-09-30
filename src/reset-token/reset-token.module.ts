import { Module, forwardRef } from '@nestjs/common';
import { ResetTokenService } from './services/reset-token/reset-token.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        forwardRef(()=> UserModule)
    ],
    providers:[ResetTokenService]
    ,
    exports:[ResetTokenService]
})
export class ResetTokenModule {}
