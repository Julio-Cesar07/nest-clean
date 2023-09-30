import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { CommentOnAnswerUseCase } from '../comment-on-answer';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer', () => {
	beforeEach(async () => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new CommentOnAnswerUseCase(
			inMemoryAnswerRepository,
			inMemoryAnswerCommentsRepository,
		);
	});

	it('should be able to comment on answer', async () => {
		const newAnswer = makeAnswer();

		await inMemoryAnswerRepository.create(newAnswer);

		await sut.execute({
			authorId: 'user-1',
			content: 'Comment example',
			answerId: newAnswer.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items[0]).toMatchObject({
			content: 'Comment example',
		});
	});
});
