import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/interfaces/question-comments-repository';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository{
	public items: QuestionComments[] = [];
	async create(questionComments: QuestionComments): Promise<void> {
		this.items.push(questionComments);
	}
    
	async findById(questionCommentsId: string): Promise<QuestionComments | null> {
		const questionComments = this.items.find(item => item.id.toString() === questionCommentsId);

		return questionComments ?? null;
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComments[]> {
		const questionComments = this.items
			.filter(item => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return questionComments;
	}

	async delete(questionComments: QuestionComments): Promise<void> {
		const questionCommentsIndex = this.items.findIndex(item => item.id === questionComments.id);

		this.items.splice(questionCommentsIndex, 1);
	}
}