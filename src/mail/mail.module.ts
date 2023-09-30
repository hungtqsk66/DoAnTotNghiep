import { Module } from '@nestjs/common';
import { MailService } from './service/mail/mail.service';
import { ResetTokenModule } from 'src/reset-token/reset-token.module';

@Module({
  imports:[ResetTokenModule],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
