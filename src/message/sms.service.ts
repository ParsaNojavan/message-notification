import { Injectable } from '@nestjs/common';
import MessageService from './abstract/message.service';

@Injectable()
export class SmsMessageService implements MessageService {
  async sendOtp(recipient: string, code: string, metadata?: Record<string, any>): Promise<void> {
    console.log(`[SMS Provider] Sending OTP [${code}] to Phone: ${recipient}`);
  }
}
