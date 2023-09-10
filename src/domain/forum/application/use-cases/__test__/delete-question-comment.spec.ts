import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from '../delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment', () => {
	beforeEach(async () => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
	});

	it('should be able to delete a question comment', async () => {
		const newQuestionComment = makeQuestionComment();

		await inMemoryQuestionCommentsRepository.create(newQuestionComment);

		await sut.execute({
			authorId: newQuestionComment.authorId.toString(),
			questionCommentId: newQuestionComment.id.toString(),
		});

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user question comment', async () => {
		const newQuestionComment = makeQuestionComment({
			authorId: new UniqueEntityId('author-1'),
		});

		await inMemoryQuestionCommentsRepository.create(newQuestionComment);

		const result = await sut.execute({
			authorId: 'author-2',
			questionCommentId: newQuestionComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
