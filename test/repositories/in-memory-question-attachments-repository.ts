import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/question-attachments-reposiotry';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = [];
	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items.push(...attachments);
	}
	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items = this.items.filter((item) => {
			return !attachments.some((attachmentDelete) =>
				attachmentDelete.equals(item),
			);
		});
	}
	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() === questionId,
		);

		return questionAttachments;
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		);

		this.items = questionAttachments;
	}
}
