import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';

describe('Delete answer (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AnswerFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[Delete] /answers/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const answerId = answer.id.toString();

		const response = await request(app.getHttpServer())
			.delete(`/answers/${answerId}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(204);

		const answerOnDatabase = await prismaService.answer.findUnique({
			where: {
				id: answerId,
			},
		});

		expect(answerOnDatabase).toBeFalsy();
	});
});
