import { AnswerRepository } from '../repositories/interfaces/answers-repository';
import { AnswerComments } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/interfaces/answer-comments-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

interface CommentOnQuestioUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnQuestioUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answerComment: AnswerComments;
	}
>;

export class CommentOnQuestioUseCase {
	constructor(
		private answerRepository: AnswerRepository,
		private answerCommentsReposioty: AnswerCommentsRepository
	) {}

	async execute({
		content,
		authorId,
		answerId,
	}: CommentOnQuestioUseCaseRequest): Promise<CommentOnQuestioUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) return left(new ResourceNotFoundError());

		const answerComment = AnswerComments.create({
			authorId: new UniqueEntityId(authorId),
			answerId: new UniqueEntityId(answerId),
			content,
		});

		await this.answerCommentsReposioty.create(answerComment);

		return right({
			answerComment,
		});
	}
}
