import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/make-question';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';

describe('Edit question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let questionFactory: QuestionFactory;
	let jwtService: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				QuestionAttachmentFactory,
				AttachmentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		jwtService = moduleRef.get(JwtService);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});
	test('[PUT] /questions/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment1.id,
			questionId: question.id,
		});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment2.id,
			questionId: question.id,
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const questionId = question.id.toString();

		const response = await request(app.getHttpServer())
			.put(`/questions/${questionId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New Title',
				content: 'New Content',
				attachmentsIds: [attachment1.id.toString(), attachment3.id.toString()],
			});

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prismaService.question.findFirst({
			where: {
				authorId: user.id.toString(),
			},
		});

		expect(questionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prismaService.attachment.findMany({
			where: {
				questionId,
			},
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
		expect(attachmentsOnDatabase).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: attachment1.id.toString(),
				}),
				expect.objectContaining({
					id: attachment3.id.toString(),
				}),
			]),
		);
	});
});
