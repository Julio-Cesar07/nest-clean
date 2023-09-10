import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from '../delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment', () => {
	beforeEach(async () => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to delete a answer comment', async () => {
		const newAnswerComment = makeAnswerComment();

		await inMemoryAnswerCommentsRepository.create(newAnswerComment);

		await sut.execute({
			authorId: newAnswerComment.authorId.toString(),
			answerCommentId: newAnswerComment.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user answer comment', async () => {
		const newAnswerComment = makeAnswerComment({
			authorId: new UniqueEntityId('author-1'),
		});

		await inMemoryAnswerCommentsRepository.create(newAnswerComment);

		const result = await sut.execute({
			authorId: 'author-2',
			answerCommentId: newAnswerComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
