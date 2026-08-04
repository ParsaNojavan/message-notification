import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import type Notification from '@app/contracts/models/dtos/notification/notification.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @EventPattern('notification.send')
  async handleSendNotification(@Payload() payload: Notification) {

    console.log(payload)

    if (!payload.recipientIds || payload.recipientIds.length === 0) {
      return;
    }

    await this.notificationService.saveNotifications(payload);

    await this.notificationService.sendPushNotification(payload);
  }
}
