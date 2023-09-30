import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerRepository } from '../repositories/interfaces/answers-repository';
import { Either, right } from '@/core/either';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';

interface AnswerQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	attachmentsIds: string[];
	content: string;
}

type AnswerQuestionUseCaseResponse = Either<
	null,
	{
		answer: Answer;
	}
>;

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswerRepository) {}

	async execute({
		authorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
		});

		const answerAttachments = attachmentsIds.map((attachmentId) =>
			AnswerAttachment.create({
				answerId: answer.id,
				attachmentId: new UniqueEntityId(attachmentId),
			}),
		);

		answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}
