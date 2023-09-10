import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[POST] /sessions', async () => {
		await prismaService.user.create({
			data: {
				name: 'John Dow',
				email: 'johndoe@example.com',
				password: await hash('123456', 8),
			},
		});

		const response = await request(app.getHttpServer()).post('/sessions').send({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual(
			expect.objectContaining({
				access_token: expect.any(String),
			}),
		);
	});
});
