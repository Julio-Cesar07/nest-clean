import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';

describe('Create question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[POST] /questions', async () => {
		const user = await prismaService.user.create({
			data: {
				name: 'John Dow',
				email: 'johndoe@example.com',
				password: '123456',
			},
		});

		const accessToken = jwtService.sign({ sub: user.id });

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
				authorId: user.id,
			},
		});

		expect(questionOnDatabase).toBeTruthy();
	});
});
