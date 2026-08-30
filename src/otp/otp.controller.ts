import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OtpService } from './otp.service';
import { OtpChannel } from '@app/contracts/models/enums/otp-type';

@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) { }

    @EventPattern('notification.send-otp')
    async handleSendOtp(@Payload() payload: {
        channel: OtpChannel;
        recipient: string;
        code: string;
        metadata?: Record<string, any>;
    }) {
        await this.otpService.processSendOtp(payload);
    }
}
