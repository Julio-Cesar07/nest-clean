import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export abstract class QuestionCommentsRepository {
	abstract create(questionComments: QuestionComments): Promise<void>;
	abstract findById(
		questionCommentsId: string,
	): Promise<QuestionComments | null>;
	abstract findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComments[]>;
	abstract findManyByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]>;
	abstract delete(questionComments: QuestionComments): Promise<void>;
}
