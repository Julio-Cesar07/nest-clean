import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comment';

export interface AnswerCommentsRepository {
	create(answerComment: AnswerComments): Promise<void>;
	findById(answerCommentsId: string): Promise<AnswerComments | null>;
	findManyByAnswerId(
		answerId: string,
		params: PaginationParams
	): Promise<AnswerComments[]>;
	delete(answerComment: AnswerComments): Promise<void>;
}
