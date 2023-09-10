import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { ListRecentQuestionsUseCase } from '../list-recent-questions';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: ListRecentQuestionsUseCase;

describe('List Recent Questions', () => {
	beforeEach(async () => {
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository
		);
		sut = new ListRecentQuestionsUseCase(inMemoryQuestionRepository);
	});

	it('should be able to list recent questions', async () => {
		await inMemoryQuestionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 20),
			})
		);
		await inMemoryQuestionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 18),
			})
		);
		await inMemoryQuestionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 23),
			})
		);

		const result = await sut.execute({
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
		]);
	});

	it('should be able to list paginated recent questions', async () => {
		for (let i = 0; i < 22; i++) {
			await inMemoryQuestionRepository.create(makeQuestion());
		}

		const result = await sut.execute({
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questions).toHaveLength(2);
	});
});
