import { Injectable } from '@nestjs/common';
import MessageService from './abstract/message.service';

@Injectable()
export class EmailMessageService implements MessageService {
  async sendOtp(recipient: string, code: string, metadata?: Record<string, any>): Promise<void> {
    console.log(`[Email Provider] Sending OTP [${code}] to email: ${recipient}`);
  }
}
