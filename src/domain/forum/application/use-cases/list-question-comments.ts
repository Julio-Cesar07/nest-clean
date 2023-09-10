import { Either, right } from '@/core/either';
import { QuestionComments } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/interfaces/question-comments-repository';

interface ListQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type ListQuestionCommentsUseCaseResponse = Either<
	null,
	{
		questionComments: QuestionComments[];
	}
>;

export class ListQuestionCommentsUseCase {
	constructor(private questionCommentRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
		const questionComments =
			await this.questionCommentRepository.findManyByQuestionId(questionId, {
				page,
			});

		return right({
			questionComments,
		});
	}
}
