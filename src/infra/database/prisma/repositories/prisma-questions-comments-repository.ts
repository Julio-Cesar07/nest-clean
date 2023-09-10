import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/interfaces/question-comments-repository';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	create(questionComments: QuestionComments): Promise<void> {
		throw new Error('Method not implemented.');
	}
	findById(questionCommentsId: string): Promise<QuestionComments | null> {
		throw new Error('Method not implemented.');
	}
	findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComments[]> {
		throw new Error('Method not implemented.');
	}
	delete(questionComments: QuestionComments): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
