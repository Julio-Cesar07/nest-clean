import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from '../create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository,
		);
		sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
	});
	it('should be able to create a question', async () => {
		const result = await sut.execute({
			content: 'Nova reposta',
			authorId: '1',
			title: 'Oie, eu sou o goku?',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question);
		expect(
			inMemoryQuestionRepository.items[0].attachments.getItems(),
		).toHaveLength(2);
		expect(inMemoryQuestionRepository.items[0].attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
	it('should persist attachments when creating a new question', async () => {
		const result = await sut.execute({
			content: 'Nova reposta',
			authorId: '1',
			title: 'Oie, eu sou o goku?',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
		expect(inMemoryQuestionAttachmentRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
					questionId: result.value?.question.id,
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('2'),
					questionId: result.value?.question.id,
				}),
			]),
		);
	});
});
