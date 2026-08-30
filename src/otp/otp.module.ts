import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import MessageService from 'src/message/abstract/message.service';
import { SmsMessageService } from 'src/message/sms.service';
import { EmailMessageService } from 'src/message/email.service';

@Module({
  controllers: [OtpController],
  providers: [
    OtpService,
    SmsMessageService,
    EmailMessageService
  ]
})
export class OtpModule { }
