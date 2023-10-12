import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionRepository } from '@/domain/forum/application/repositories/interfaces/question-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/interfaces/question-attachments-reposiotry';

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly questionAttachmentRepository: QuestionAttachmentsRepository,
	) {}
	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		await this.prisma.question.create({
			data,
		});

		await this.questionAttachmentRepository.createMany(
			question.attachments.getItems(),
		);
	}
	async findById(questionId: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				id: questionId,
			},
		});

		return question ? PrismaQuestionMapper.toDomain(question) : null;
	}
	async findBySlug(slug: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
		});

		return question ? PrismaQuestionMapper.toDomain(question) : null;
	}
	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: 20 * (page - 1),
		});

		return questions.map((item) => PrismaQuestionMapper.toDomain(item));
	}
	async save(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		await Promise.all([
			await this.prisma.question.update({
				data,
				where: {
					id: data.id,
				},
			}),

			await this.questionAttachmentRepository.createMany(
				question.attachments.getNewItems(),
			),

			await this.questionAttachmentRepository.deleteMany(
				question.attachments.getRemovedItems(),
			),
		]);
	}
	async delete(question: Question): Promise<void> {
		await this.prisma.question.delete({
			where: {
				id: question.id.toString(),
			},
		});
	}
}
