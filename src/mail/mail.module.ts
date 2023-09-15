import { Module } from '@nestjs/common';
import { MailService } from './service/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports:[
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
        from: '"No Reply" <nguyenthanhhungso@gmail.com>',
      }
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
