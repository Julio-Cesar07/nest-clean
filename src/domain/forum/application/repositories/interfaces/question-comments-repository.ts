import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';

export interface QuestionCommentsRepository {
	create(questionComments: QuestionComments): Promise<void>;
	findById(questionCommentsId: string): Promise<QuestionComments | null>;
	findManyByQuestionId(
		questionId: string,
		params: PaginationParams
	): Promise<QuestionComments[]>;
	delete(questionComments: QuestionComments): Promise<void>;
}
