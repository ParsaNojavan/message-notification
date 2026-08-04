import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, index: true })
  recipientId: string;

  @Prop({ required: true })
  senderId: string;

  @Prop()
  senderName?: string;

  @Prop({ required: true, index: true })
  roomId: string;

  @Prop({ required: true })
  messageId: string;

  @Prop({ required: true })
  messagePreview: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ recipientId: 1, roomId: 1, isRead: 1 });

NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 });
