import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';

export abstract class QuestionCommentsRepository {
	abstract create(questionComments: QuestionComments): Promise<void>;
	abstract findById(
		questionCommentsId: string,
	): Promise<QuestionComments | null>;
	abstract findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComments[]>;
	abstract delete(questionComments: QuestionComments): Promise<void>;
}
