import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/question-attachments-reposiotry';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = [];

	async findManyByQuestionId(
		questionId: string
	): Promise<QuestionAttachment[]> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId === new UniqueEntityId(questionId)
		);

		return questionAttachments;
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() !== questionId
		);

		this.items = questionAttachments;
	}
}
