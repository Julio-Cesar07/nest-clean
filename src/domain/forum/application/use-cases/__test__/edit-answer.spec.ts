import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { EditAnswerUseCase } from '../edit-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { makeAnswerAttachments } from 'test/factories/make-answer-attachments';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe('Edit answer', () => {
	beforeEach(async () => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		sut = new EditAnswerUseCase(
			inMemoryAnswerRepository,
			inMemoryAnswerAttachmentsRepository
		);
	});

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer();

		await inMemoryAnswerRepository.create(newAnswer);

		inMemoryAnswerAttachmentsRepository.items.push(
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
			authorId: newAnswer.authorId.toString(),
			answerId: newAnswer.id.toString(),
			content: 'Novo conteudo teste',
			attachmentsIds: ['1', '3'],
		});

		expect(inMemoryAnswerRepository.items[0]).toMatchObject({
			content: 'Novo conteudo teste',
		});
		expect(
			inMemoryAnswerRepository.items[0].attachments.getItems()
		).toHaveLength(2);
		expect(inMemoryAnswerRepository.items[0].attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer();

		await inMemoryAnswerRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: 'author-not-owner',
			content: 'nao importa',
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
