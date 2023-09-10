import { Either, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerRepository } from '../repositories/interfaces/answers-repository';

interface ListQuestionAnswersUseCaseRequest {
	questionId: string;
	page: number;
}

type ListQuestionAnswersUseCaseResponse = Either<
	null,
	{
		answers: Answer[];
	}
>;

export class ListQuestionAnswersUseCase {
	constructor(private answerRepository: AnswerRepository) {}

	async execute({
		questionId,
		page,
	}: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
		const answers = await this.answerRepository.findManyByQuestionId(
			questionId,
			{
				page,
			}
		);

		return right({
			answers,
		});
	}
}
