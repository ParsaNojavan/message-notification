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

  async sendPushNotification(payload: any) {
    try {
      await this.redis.publish('notifications:event', JSON.stringify(payload));
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

  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const notifications = await this.notificationModel
      .find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.notificationModel.countDocuments({ recipientId: userId });

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };

  }

  async seenNotifications(payload: { roomId: string; userId: string; messageIds: string[]; }) {
    await this.notificationModel.updateMany({
      messageId: { $in: payload.messageIds }
    }, { $set: { isRead: true } });


  }
}
