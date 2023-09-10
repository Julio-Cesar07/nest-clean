import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from '../choose-question-best-answer';
import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer', () => {
	beforeEach(async () => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository
		);
		sut = new ChooseQuestionBestAnswerUseCase(
			inMemoryAnswerRepository,
			inMemoryQuestionRepository
		);
	});

	it('should be able to choose the question best answer', async () => {
		const newQuestion = makeQuestion();
		const newAnswer = makeAnswer({
			questionId: newQuestion.id,
		});

		await inMemoryQuestionRepository.create(newQuestion);
		await inMemoryAnswerRepository.create(newAnswer);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newQuestion.authorId.toString(),
		});

		expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(
			newAnswer.id
		);
	});

	it('should not be able to choose another user question best answer', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId('author-1'),
		});
		const newAnswer = makeAnswer({
			questionId: newQuestion.id,
		});

		await inMemoryQuestionRepository.create(newQuestion);
		await inMemoryAnswerRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
