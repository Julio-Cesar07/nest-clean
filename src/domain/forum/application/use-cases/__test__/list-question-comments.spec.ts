import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { ListQuestionCommentsUseCase } from '../list-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryStudenteRepository } from 'test/repositories/in-memory-student-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentRepository: InMemoryStudenteRepository;
let sut: ListQuestionCommentsUseCase;

describe('List Question Comments', () => {
	beforeEach(async () => {
		inMemoryStudentRepository = new InMemoryStudenteRepository();
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentRepository,
		);
		sut = new ListQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it('should be able to list question comments', async () => {
		const student = await makeStudent({
			name: 'John doe',
		});

		inMemoryStudentRepository.create(student);

		const newQuestion = makeQuestion();
		for (let i = 0; i < 4; i++)
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({
					questionId: newQuestion.id,
					authorId: student.id,
				}),
			);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.comments).toHaveLength(4);
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					author: student.name,
				}),
			]),
		);
	});

	it('should be able to list paginated question comments', async () => {
		const student = await makeStudent();

		inMemoryStudentRepository.create(student);

		const newQuestion = makeQuestion();
		for (let i = 0; i < 22; i++)
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({
					questionId: newQuestion.id,
					authorId: student.id,
				}),
			);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.comments).toHaveLength(2);
	});
});
