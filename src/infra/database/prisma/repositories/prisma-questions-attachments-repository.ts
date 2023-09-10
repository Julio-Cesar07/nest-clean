import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/question-attachments-reposiotry';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		throw new Error('Method not implemented.');
	}
	deleteManyByQuestionId(questionId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
