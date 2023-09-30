import { Either, left, right } from '@/core/either';
import { QuestionRepository } from '../repositories/interfaces/question-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

@Injectable()
export class DeleteQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}

	async execute({
		questionId,
		authorId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId);

		if (!question) return left(new ResourceNotFoundError());

		if (authorId !== question.authorId.toString())
			return left(new NotAllowedError());

		await this.questionRepository.delete(question);

		return right(null);
	}
}
