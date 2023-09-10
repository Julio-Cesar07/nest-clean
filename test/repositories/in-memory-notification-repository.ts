import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationRepository implements NotificationRepository {
	public items: Notification[] = [];
	async create(notification: Notification): Promise<void> {
		this.items.push(notification);
	}
	async findById(notificationId: string): Promise<Notification | null> {
		const notification = this.items.find(
			(item) => item.id.toString() === notificationId
		);

		return notification ?? null;
	}
	async save(notification: Notification): Promise<void> {
		const notificationIndex = this.items.findIndex(
			(item) => item.id.toString() === notification.id.toString()
		);

		if (notificationIndex < 0) return;

		this.items[notificationIndex] = notification;
	}
}
