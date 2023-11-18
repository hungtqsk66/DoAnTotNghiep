import { Module } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { ResetTokenModule } from 'src/modules/reset-token.module';

@Module({
  imports:[ResetTokenModule],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
