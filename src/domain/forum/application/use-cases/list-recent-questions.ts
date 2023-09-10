import { Either, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/interfaces/question-repository';
import { Injectable } from '@nestjs/common';

interface ListRecentQuestionsUseCaseRequest {
	page: number;
}

type ListRecentQuestionsUseCaseResponse = Either<
	null,
	{
		questions: Question[];
	}
>;

@Injectable()
export class ListRecentQuestionsUseCase {
	constructor(private questionRepository: QuestionRepository) {}

	async execute({
		page,
	}: ListRecentQuestionsUseCaseRequest): Promise<ListRecentQuestionsUseCaseResponse> {
		const questions = await this.questionRepository.findManyRecent({
			page,
		});

		return right({
			questions,
		});
	}
}
