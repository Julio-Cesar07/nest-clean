import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { ListQuestionCommentsUseCase } from '../list-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: ListQuestionCommentsUseCase;

describe('List Question Comments', () => {
	beforeEach(async () => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new ListQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it('should be able to list question comments', async () => {
		const newQuestion = makeQuestion();
		for (let i = 0; i < 4; i++)
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({
					questionId: newQuestion.id,
				})
			);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questionComments).toHaveLength(4);
	});

	it('should be able to list paginated question comments', async () => {
		const newQuestion = makeQuestion();
		for (let i = 0; i < 22; i++)
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({
					questionId: newQuestion.id,
				})
			);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questionComments).toHaveLength(2);
	});
});
