import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';

describe('Create question answers (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[GET] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
		});

		await Promise.all([
			questionCommentFactory.makePrismaQuestionComment({
				questionId: question.id,
				authorId: user.id,
				content: 'Comment 01',
			}),
			questionCommentFactory.makePrismaQuestionComment({
				questionId: question.id,
				authorId: user.id,
				content: 'Comment 02',
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/comments`)
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
