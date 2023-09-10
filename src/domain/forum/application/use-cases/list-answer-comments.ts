import { Either, right } from '@/core/either';
import { AnswerComments } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/interfaces/answer-comments-repository';

interface ListAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

type ListAnswerCommentsUseCaseResponse = Either<
	null,
	{
		answerComments: AnswerComments[];
	}
>;

export class ListAnswerCommentsUseCase {
	constructor(private answerCommentRepository: AnswerCommentsRepository) {}

	async execute({
		answerId,
		page,
	}: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
		const answerComments =
			await this.answerCommentRepository.findManyByAnswerId(answerId, {
				page,
			});

		return right({
			answerComments,
		});
	}
}
