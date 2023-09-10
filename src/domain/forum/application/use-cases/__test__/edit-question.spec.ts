import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { EditQuestionUseCase } from '../edit-question';
import { makeQuestion } from 'test/factories/make-question';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachments } from 'test/factories/make-question-attachments';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit question', () => {
	beforeEach(async () => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		);
		sut = new EditQuestionUseCase(
			inMemoryQuestionRepository,
			inMemoryQuestionAttachmentsRepository
		);
	});

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion();

		await inMemoryQuestionRepository.create(newQuestion);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachments({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachments({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			})
		);

		await sut.execute({
			authorId: newQuestion.authorId.toString(),
			questionId: newQuestion.id.toString(),
			content: 'Novo conteúdo teste',
			title: 'Nova pergunta test',
			attachmentsIds: ['1', '3'],
		});

		expect(inMemoryQuestionRepository.items[0]).toMatchObject({
			content: 'Novo conteúdo teste',
			title: 'Nova pergunta test',
		});
		expect(
			inMemoryQuestionRepository.items[0].attachments.getItems()
		).toHaveLength(2);
		expect(inMemoryQuestionRepository.items[0].attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion();

		await inMemoryQuestionRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'author-not-owner',
			content: 'nao importa',
			title: 'tambem não importa',
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
