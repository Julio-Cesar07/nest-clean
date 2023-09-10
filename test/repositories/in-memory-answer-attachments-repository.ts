import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
implements AnswerAttachmentsRepository
{
	public items: AnswerAttachment[] = [];

	async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const answerAttachments = this.items.filter(
			(item) => item.answerId === new UniqueEntityId(answerId)
		);

		return answerAttachments;
	}

	async deleteManyByAnswerId(answerId: string): Promise<void> {
		const answerAttachments = this.items.filter(
			(item) => item.answerId.toString() !== answerId
		);

		this.items = answerAttachments;
	}
}
