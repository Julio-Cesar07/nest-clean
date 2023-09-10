import { PaginationParams } from '@/core/repositories/pagination-params';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export interface AnswerRepository {
	create(answer: Answer): Promise<void>;
	findById(answerId: string): Promise<Answer | null>;
	findManyByQuestionId(
		questionId: string,
		params: PaginationParams
	): Promise<Answer[]>;
	save(answer: Answer): Promise<void>;
	delete(answer: Answer): Promise<void>;
}
