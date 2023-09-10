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
	test('[GET] /questions', async () => {
		const user = await prismaService.user.create({
			data: {
				name: 'John Dow',
				email: 'johndoe@example.com',
				password: '123456',
			},
		});

		const accessToken = jwtService.sign({ sub: user.id });

		await prismaService.question.createMany({
			data: [
				{
					content: 'Conteudo da questão 1',
					title: 'Titulo da questão 1',
					slug: 'titulo-da-questão1',
					authorId: user.id,
				},
				{
					content: 'Conteudo da questão 2',
					title: 'Titulo da questão 2',
					slug: 'titulo-da-questão2',
					authorId: user.id,
				},
			],
		});

		const response = await request(app.getHttpServer())
			.get('/questions')
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				questions: expect.any(Array),
			}),
		);
		expect(response.body.questions).toHaveLength(2);
	});
});
