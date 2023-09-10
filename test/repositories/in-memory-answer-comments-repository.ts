import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/interfaces/answer-comments-repository';
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository
implements AnswerCommentsRepository
{
	public items: AnswerComments[] = [];
	async create(answerComment: AnswerComments): Promise<void> {
		this.items.push(answerComment);
	}

	async findById(answerCommentId: string): Promise<AnswerComments | null> {
		const answerComment = this.items.find(
			(item) => item.id.toString() === answerCommentId
		);

		return answerComment ?? null;
	}

	async findManyByAnswerId(
		answerId: string,
		{ page }: PaginationParams
	): Promise<AnswerComments[]> {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20);

		return answerComments;
	}

	async delete(answerComment: AnswerComments): Promise<void> {
		const answerCommentIndex = this.items.findIndex(
			(item) => item.id === answerComment.id
		);

		this.items.splice(answerCommentIndex, 1);
	}
}
