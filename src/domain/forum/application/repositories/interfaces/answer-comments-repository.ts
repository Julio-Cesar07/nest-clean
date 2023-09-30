import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comment';

export abstract class AnswerCommentsRepository {
	abstract create(answerComment: AnswerComments): Promise<void>;
	abstract findById(answerCommentsId: string): Promise<AnswerComments | null>;
	abstract findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComments[]>;
	abstract delete(answerComment: AnswerComments): Promise<void>;
}
