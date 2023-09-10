import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from '../answer-question';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer a Question', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		sut = new AnswerQuestionUseCase(inMemoryAnswerRepository);
	});

	it('create an answer', async () => {
		const result = await sut.execute({
			content: 'Nova reposta',
			instructorId: '1',
			questionId: '1',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer);
		expect(
			inMemoryAnswerRepository.items[0].attachments.getItems()
		).toHaveLength(2);
		expect(inMemoryAnswerRepository.items[0].attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
