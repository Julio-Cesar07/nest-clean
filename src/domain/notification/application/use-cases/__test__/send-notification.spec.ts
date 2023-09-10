import { SendNotificationUseCase } from '../send-notification';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;

describe('Create Notification', () => {
	beforeEach(() => {
		inMemoryNotificationRepository = new InMemoryNotificationRepository();
		sut = new SendNotificationUseCase(inMemoryNotificationRepository);
	});
	it('should be able to create a notification', async () => {
		const result = await sut.execute({
			content: 'Nova reposta',
			title: 'Oie, eu sou o goku?',
			recipientId: '1',
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryNotificationRepository.items[0]).toEqual(
			result.value?.notification
		);
	});
});
