import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/question-attachments-reposiotry';
import { QuestionRepository } from '@/domain/forum/application/repositories/interfaces/question-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentsRepository: QuestionAttachmentsRepository
	) {}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);

		return question ?? null;
	}

	async findById(questionId: string): Promise<Question | null> {
		const question = this.items.find(
			(item) => item.id.toString() === questionId
		);

		return question ?? null;
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}

	async save(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex(
			(item) => item.id === question.id
		);

		if (questionIndex < 0) return;

		this.items[questionIndex] = question;

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex(
			(item) => item.id === question.id
		);

		this.items.splice(questionIndex, 1);

		this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toString()
		);
	}
}
