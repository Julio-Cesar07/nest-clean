import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-questions-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/interfaces/question-repository';
import { StudentRepository } from '@/domain/forum/application/repositories/interfaces/student-repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/interfaces/answers-repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/interfaces/question-comments-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-questions-comments-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/question-attachments-reposiotry';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/interfaces/answer-comments-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answers-attachments-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/answer-attachments-repository';
import { AttachmentRepository } from '@/domain/forum/application/repositories/interfaces/attachment-repository';
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository';

@Module({
	providers: [
		PrismaService,
		{
			provide: StudentRepository,
			useClass: PrismaStudentRepository,
		},
		{
			provide: QuestionRepository,
			useClass: PrismaQuestionRepository,
		},
		{
			provide: QuestionCommentsRepository,
			useClass: PrismaQuestionCommentsRepository,
		},
		{
			provide: QuestionAttachmentsRepository,
			useClass: PrismaQuestionAttachmentsRepository,
		},
		{
			provide: AnswerRepository,
			useClass: PrismaAnswersRepository,
		},
		{
			provide: AnswerCommentsRepository,
			useClass: PrismaAnswerCommentsRepository,
		},
		{
			provide: AnswerAttachmentsRepository,
			useClass: PrismaAnswerAttachmentsRepository,
		},
		{
			provide: AttachmentRepository,
			useClass: PrismaAttachmentRepository,
		},
	],
	exports: [
		PrismaService,
		StudentRepository,
		QuestionRepository,
		QuestionCommentsRepository,
		QuestionAttachmentsRepository,
		AnswerRepository,
		AnswerCommentsRepository,
		AnswerAttachmentsRepository,
		AttachmentRepository,
	],
})
export class DatabaseModule {}
