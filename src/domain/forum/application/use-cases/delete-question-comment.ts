import { Either, left, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/interfaces/question-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string;
	questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsReposioty: QuestionCommentsRepository) {}

	async execute({
		questionCommentId,
		authorId,
	}: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment =
			await this.questionCommentsReposioty.findById(questionCommentId);

		if (!questionComment) return left(new ResourceNotFoundError());

		if (questionComment.authorId.toString() !== authorId)
			return left(new NotAllowedError());

		await this.questionCommentsReposioty.delete(questionComment);

		return right(null);
	}
}
