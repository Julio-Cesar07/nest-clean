import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/interfaces/question-comments-repository';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudenteRepository } from './in-memory-student-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	public items: QuestionComments[] = [];

	constructor(private studentRepository: InMemoryStudenteRepository) {}

	async create(questionComments: QuestionComments): Promise<void> {
		this.items.push(questionComments);
	}

	async findById(questionCommentsId: string): Promise<QuestionComments | null> {
		const questionComments = this.items.find(
			(item) => item.id.toString() === questionCommentsId,
		);

		return questionComments ?? null;
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComments[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return questionComments;
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)
			.map((comment) => {
				const author = this.studentRepository.items.find((item) =>
					item.id.equals(comment.authorId),
				);

				if (!author) {
					throw new ResourceNotFoundError();
				}

				return CommentWithAuthor.create({
					content: comment.content,
					commentId: comment.id,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					authorId: comment.authorId,
					author: author.name,
				});
			});

		return questionComments;
	}

	async delete(questionComments: QuestionComments): Promise<void> {
		const questionCommentsIndex = this.items.findIndex(
			(item) => item.id === questionComments.id,
		);

		this.items.splice(questionCommentsIndex, 1);
	}
}
