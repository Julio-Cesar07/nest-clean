import { Either, left, right } from '@/core/either';
import { AnswerCommentsRepository } from '../repositories/interfaces/answer-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentsReposioty: AnswerCommentsRepository) {}

	async execute({
		answerCommentId,
		authorId,
	}: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment =
			await this.answerCommentsReposioty.findById(answerCommentId);

		if (!answerComment) return left(new ResourceNotFoundError());

		if (answerComment.authorId.toString() !== authorId)
			return left(new NotAllowedError());

		await this.answerCommentsReposioty.delete(answerComment);

		return right(null);
	}
}
