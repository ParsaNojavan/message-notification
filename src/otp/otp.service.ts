import { OtpChannel } from '@app/contracts/models/enums/otp-type';
import { Injectable } from '@nestjs/common';
import MessageService from 'src/message/abstract/message.service';
import { EmailMessageService } from 'src/message/email.service';
import { SmsMessageService } from 'src/message/sms.service';

@Injectable()
export class OtpService {
    private channels: Map<OtpChannel, MessageService>;
    constructor(
        private readonly smsService: SmsMessageService,
        private readonly emailService: EmailMessageService,
    ) {
        this.channels = new Map<OtpChannel, MessageService>([
            [OtpChannel.SMS, this.smsService],
            [OtpChannel.EMAIL, this.emailService],
        ]);
    }

    async processSendOtp(payload: {
        channel: OtpChannel;
        recipient: string;
        code: string;
        metadata?: Record<string, any>;
    }): Promise<void> {
        const handler = this.channels.get(payload.channel);

        if (!handler) {
            console.error(`[Notification] Unsupported channel: ${payload.channel}`);
            return;
        }

        await handler.sendOtp(payload.recipient, payload.code, payload.metadata);
    }
}
