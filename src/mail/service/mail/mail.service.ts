import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {ResetPasswordHTMLBody} from '../../utils/resetPWD.format';
import { EmailDTO } from 'src/user/dto/email.dto';
import { ResetTokenService } from 'src/reset-token/services/reset-token/reset-token.service';
import { SuccessResponse } from 'src/utils/dto/successResponse.dto';

@Injectable()
export class MailService  {
    constructor(
      private readonly mailerService: MailerService,
      private readonly resetTokenService:ResetTokenService
    ){}

    async sendVerifyChangePassword(emailPayload:EmailDTO):Promise<SuccessResponse>{
        
      const {userId,resetToken} = await this.resetTokenService.generateResetToken(emailPayload.email);
        
      await this.mailerService.sendMail({
        to: `${emailPayload.email}`,
        from: 'k26.audio@gmail.com', 
        subject: 'Verify password change',
        html: ResetPasswordHTMLBody(userId,resetToken), // HTML body content
      });
      return new SuccessResponse({message:`Mail sent to ${emailPayload.email}, pls check`});
    }

}
