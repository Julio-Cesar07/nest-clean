import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { DeleteAnswerUseCase } from '../delete-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachments } from 'test/factories/make-answer-attachments';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe('Delete answer', () => {
	beforeEach(async () => {
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentRepository
		);
		sut = new DeleteAnswerUseCase(inMemoryAnswerRepository);
	});

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer();

		await inMemoryAnswerRepository.create(newAnswer);

		inMemoryAnswerAttachmentRepository.items.push(
			makeAnswerAttachments({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeAnswerAttachments({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('2'),
			})
		);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newAnswer.authorId.toString(),
		});

		expect(inMemoryAnswerRepository.items).toHaveLength(0);
		expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer();

		await inMemoryAnswerRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: 'author-not-owner',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
