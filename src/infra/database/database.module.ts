import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-questions-comments-repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswersAttachmentsRepository } from './prisma/repositories/prisma-answers-attachments-repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/interfaces/question-repository';
import { StudentRepository } from '@/domain/forum/application/repositories/interfaces/student-repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository';

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionRepository,
			useClass: PrismaQuestionRepository,
		},
		{
			provide: StudentRepository,
			useClass: PrismaStudentRepository,
		},
		PrismaQuestionCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswersAttachmentsRepository,
		PrismaAnswersRepository,
	],
	exports: [
		PrismaService,
		QuestionRepository,
		StudentRepository,
		PrismaQuestionCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswersAttachmentsRepository,
		PrismaAnswersRepository,
	],
})
export class DatabaseModule {}
