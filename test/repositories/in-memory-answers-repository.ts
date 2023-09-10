import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerRepository } from '@/domain/forum/application/repositories/interfaces/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/answer-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryAnswersRepository implements AnswerRepository {
	public items: Answer[] = [];

	constructor(
		private answerAttachmentRepository: AnswerAttachmentsRepository
	) {}

	async create(answer: Answer): Promise<void> {
		this.items.push(answer);

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}
	async save(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		if (answerIndex < 0) return;

		this.items[answerIndex] = answer;

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}
	async delete(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());

		this.items.splice(answerIndex, 1);
	}
	async findById(answerId: string): Promise<Answer | null> {
		const answer = this.items.find((item) => item.id.toString() === answerId);

		return answer ?? null;
	}
	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams
	): Promise<Answer[]> {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return answers;
	}
}
