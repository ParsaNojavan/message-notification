import NotificationDto from '@app/contracts/models/dtos/notification/notification.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Notification } from './models/concrete/notification';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {

  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,) { }

  private readonly logger = new Logger(NotificationService.name);

  async sendPushNotification(payload: NotificationDto) {
    try {
      await this.redis.publish('notifications:event',JSON.stringify(payload));
      this.logger.debug(`Push notification sent to ${payload.recipientIds.length} users for room ${payload.roomId}`);
    } catch (error) {
      this.logger.error('Error sending push notification', error);
    }
  }

  async saveNotifications(payload: NotificationDto): Promise<void> {
    try {
      const notificationsToInsert = payload.recipientIds.map((recipientId) => ({
        recipientId,
        senderId: payload.senderId,
        senderName: payload.senderName,
        roomId: payload.roomId,
        messageId: payload.messageId,
        messagePreview: payload.messagePreview,
        isRead: false,
      }));

      if (notificationsToInsert.length > 0) {
        await this.notificationModel.insertMany(notificationsToInsert);
        this.logger.log(`Saved ${notificationsToInsert.length} notifications for room ${payload.roomId}`);
      }
    } catch (error) {
      this.logger.error('Error saving notifications to DB', error);
      throw error;
    }
  }
}
