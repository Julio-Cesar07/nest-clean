import { QuestionRepository } from '../repositories/interfaces/question-repository';
import { QuestionComments } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/interfaces/question-comments-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

interface CommentOnQuestioUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestioUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComments;
	}
>;

export class CommentOnQuestioUseCase {
	constructor(
		private questionRepository: QuestionRepository,
		private questionCommentsReposioty: QuestionCommentsRepository
	) {}

	async execute({
		content,
		authorId,
		questionId,
	}: CommentOnQuestioUseCaseRequest): Promise<CommentOnQuestioUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId);

		if (!question) return left(new ResourceNotFoundError());

		const questionComment = QuestionComments.create({
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
			content,
		});

		await this.questionCommentsReposioty.create(questionComment);

		return right({
			questionComment,
		});
	}
}
