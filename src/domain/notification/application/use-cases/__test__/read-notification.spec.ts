import { makeNotification } from 'test/factories/make-notification';
import { ReadNotificationUseCase } from '../read-notification';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe('Create Notification', () => {
	beforeEach(() => {
		inMemoryNotificationRepository = new InMemoryNotificationRepository();
		sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
	});
	it('should be able to read a notification', async () => {
		const notification = makeNotification();

		await inMemoryNotificationRepository.create(notification);

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: notification.recipientId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
			expect.any(Date)
		);
	});

	it('should not be able to read a notification from another user', async () => {
		const notification = makeNotification({
			recipientId: new UniqueEntityId('recipient-1'),
		});

		await inMemoryNotificationRepository.create(notification);

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: 'recipient-not-owner',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
