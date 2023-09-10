import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/interfaces/answer-comments-repository';
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	create(answerComment: AnswerComments): Promise<void> {
		throw new Error('Method not implemented.');
	}
	findById(answerCommentsId: string): Promise<AnswerComments | null> {
		throw new Error('Method not implemented.');
	}
	findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComments[]> {
		throw new Error('Method not implemented.');
	}
	delete(answerComment: AnswerComments): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
