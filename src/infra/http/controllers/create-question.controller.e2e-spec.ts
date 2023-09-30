import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Create question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let studentFactory: StudentFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[POST] /questions', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'Titulo da questão',
				content: 'Conteudo da questão',
			});

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prismaService.question.findFirst({
			where: {
				authorId: user.id.toString(),
			},
		});

		expect(questionOnDatabase).toBeTruthy();
	});
});
