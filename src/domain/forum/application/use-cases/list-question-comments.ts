import { Either, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/interfaces/question-comments-repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface ListQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type ListQuestionCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[];
	}
>;

@Injectable()
export class ListQuestionCommentsUseCase {
	constructor(private questionCommentRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
		const comments =
			await this.questionCommentRepository.findManyByQuestionIdWithAuthor(
				questionId,
				{
					page,
				},
			);

		return right({
			comments,
		});
	}
}
