import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { ListAnswerCommentsUseCase } from '../list-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: ListAnswerCommentsUseCase;

describe('List Answer Comments', () => {
	beforeEach(async () => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new ListAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to list answer comments', async () => {
		const newAnswer = makeAnswer();
		for (let i = 0; i < 4; i++)
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId: newAnswer.id,
				})
			);

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments).toHaveLength(4);
	});

	it('should be able to list paginated answer comments', async () => {
		const newAnswer = makeAnswer();
		for (let i = 0; i < 22; i++)
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId: newAnswer.id,
				})
			);

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments).toHaveLength(2);
	});
});
