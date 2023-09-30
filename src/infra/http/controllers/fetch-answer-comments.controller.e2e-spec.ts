import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { AnswerFactory } from 'test/factories/make-answer';

describe('Fetch answer comments (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AnswerFactory,
				AnswerCommentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test.only('[GET] /answers/:answerId/comments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({
				answerId: answer.id,
				authorId: user.id,
				content: 'Comment 01',
			}),
			answerCommentFactory.makePrismaAnswerComment({
				answerId: answer.id,
				authorId: user.id,
				content: 'Comment 02',
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/answers/${answer.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			comments: expect.arrayContaining([
				expect.objectContaining({
					content: 'Comment 01',
				}),
				expect.objectContaining({
					content: 'Comment 02',
				}),
			]),
		});
		expect(response.body.comments).toHaveLength(2);
	});
});
