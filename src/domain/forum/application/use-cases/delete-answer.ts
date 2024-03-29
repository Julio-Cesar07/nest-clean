import { Either, left, right } from '@/core/either';
import { AnswerRepository } from '../repositories/interfaces/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

@Injectable()
export class DeleteAnswerUseCase {
	constructor(private answerRepository: AnswerRepository) {}

	async execute({
		answerId,
		authorId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) return left(new ResourceNotFoundError());

		if (authorId !== answer.authorId.toString())
			return left(new NotAllowedError());

		await this.answerRepository.delete(answer);

		return right(null);
	}
}
