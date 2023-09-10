import { makeQuestion } from 'test/factories/make-question';
import { ListQuestionAnswersUseCase } from '../list-question-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: ListQuestionAnswersUseCase;

describe('List Question Answers', () => {
	beforeEach(async () => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		sut = new ListQuestionAnswersUseCase(inMemoryAnswerRepository);
	});

	it('should be able to list question answers', async () => {
		const newQuestion = makeQuestion();
		for (let i = 0; i < 4; i++)
			await inMemoryAnswerRepository.create(
				makeAnswer({
					questionId: newQuestion.id,
				})
			);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answers).toHaveLength(4);
	});

	it('should be able to list paginated question answers', async () => {
		const newQuestion = makeQuestion();
		for (let i = 0; i < 22; i++)
			await inMemoryAnswerRepository.create(
				makeAnswer({
					questionId: newQuestion.id,
				})
			);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answers).toHaveLength(2);
	});
});
