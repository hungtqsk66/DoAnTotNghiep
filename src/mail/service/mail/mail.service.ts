import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class MailService  {
    constructor(private readonly mailerService: MailerService){}

    sendVerifyChangePassword():void{
        this.mailerService.sendMail({
        to: 'nguyenthanhhungso@gmail.com', // list of receivers
        from: 'nguyenthanhhungso@gmail.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      });
      console.log('Mail send , pls check');
    }

   

}
