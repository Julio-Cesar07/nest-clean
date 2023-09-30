import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';

describe('Delete question comment (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionCommentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[Delete] /questions/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionComment =
			await questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
			});

		const questionCommentId = questionComment.id.toString();

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/${questionCommentId}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(204);

		const questionCommentOnDatabase = await prismaService.comment.findUnique({
			where: {
				id: questionCommentId,
			},
		});

		expect(questionCommentOnDatabase).toBeFalsy();
	});
});
