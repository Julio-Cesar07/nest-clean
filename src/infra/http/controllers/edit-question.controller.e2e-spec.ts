import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/make-question';

describe('Edit question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[PUT] /questions/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionId = question.id.toString();

		const response = await request(app.getHttpServer())
			.put(`/questions/${questionId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New Title',
				content: 'New Content',
			});

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prismaService.question.findFirst({
			where: {
				authorId: user.id.toString(),
			},
		});

		expect(questionOnDatabase).toBeTruthy();
	});
});
