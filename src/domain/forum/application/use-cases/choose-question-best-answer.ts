import { AnswerRepository } from '../repositories/interfaces/answers-repository';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/interfaces/question-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { Injectable } from '@nestjs/common';

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answersRepository: AnswerRepository,
		private questionRepository: QuestionRepository,
	) {}

	async execute({
		answerId,
		authorId,
	}: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) return left(new ResourceNotFoundError());

		const question = await this.questionRepository.findById(
			answer.questionId.toString(),
		);

		if (!question) return left(new ResourceNotFoundError());

		if (authorId !== question.authorId.toString())
			return left(new NotAllowedError());

		question.bestAnswerId = answer.id;

		await this.questionRepository.save(question);

		return right({ question });
	}
}
