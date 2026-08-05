import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
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

  @MessagePattern('notifications.check')
  async getNotifications(
    @Payload() payload: { userId: string, page: number, limit: number },
  ) {
    console.log(payload.userId);

    if (!payload.userId?.length) {
      return [];
    }

    return this.notificationService.getNotifications(payload.userId);
  }
}
