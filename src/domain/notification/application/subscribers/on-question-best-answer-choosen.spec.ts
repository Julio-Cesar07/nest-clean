import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import {
	SendNotificationUseCase,
	SendNotificationUseCaseRequest,
	SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { OnQuestionBestAnswerChoosen } from './on-question-best-answer-choosen';
import { makeQuestion } from 'test/factories/make-question';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { waitFor } from 'test/utils/wait-for';
import { SpyInstance } from 'vitest';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryNotificationUseCase: InMemoryNotificationRepository;
let sendNotification: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
	[SendNotificationUseCaseRequest],
	Promise<SendNotificationUseCaseResponse>
>;

describe('On Question Best Answer Choosen', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		);
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);

		inMemoryNotificationUseCase = new InMemoryNotificationRepository();
		sendNotification = new SendNotificationUseCase(inMemoryNotificationUseCase);

		sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute');

		new OnQuestionBestAnswerChoosen(inMemoryAnswerRepository, sendNotification);
	});

	it('should send a notification when question has new best answer choosen', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: new UniqueEntityId('1'),
		});

		inMemoryQuestionRepository.create(question);
		inMemoryAnswerRepository.create(answer);

		question.bestAnswerId = answer.id;

		inMemoryQuestionRepository.save(question);

		await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
	});
});
