import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/interfaces/question-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { QuestionAttachmentsRepository } from '../repositories/interfaces/question-attachments-reposiotry';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(
		private questionRepository: QuestionRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository
	) {}

	async execute({
		authorId,
		questionId,
		content,
		title,
		attachmentsIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId);

		if (!question) return left(new ResourceNotFoundError());

		if (question.authorId.toString() !== authorId)
			return left(new NotAllowedError());

		const currentQuestionAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

		const questionAttachmentList = new QuestionAttachmentList(
			currentQuestionAttachments
		);

		const questionAttachments = attachmentsIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: new UniqueEntityId(questionId),
			});
		});

		questionAttachmentList.update(questionAttachments);

		question.attachments = questionAttachmentList;
		question.title = title;
		question.content = content;

		this.questionRepository.save(question);

		return right({
			question,
		});
	}
}
