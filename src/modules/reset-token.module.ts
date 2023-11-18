import { Module} from '@nestjs/common';
import { ResetTokenService } from '../services/reset-token.service';
import { DbModule } from 'src/db/db.module';

@Module({
    imports:[
       DbModule
    ],
    providers:[ResetTokenService]
    ,
    exports:[ResetTokenService]
})
export class ResetTokenModule {}
