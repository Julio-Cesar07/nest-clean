import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerRepository } from '@/domain/forum/application/repositories/interfaces/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';

@Injectable()
export class PrismaAnswersRepository implements AnswerRepository {
	constructor(private prisma: PrismaService) {}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await this.prisma.answer.create({
			data,
		});
	}
	async findById(answerId: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id: answerId,
			},
		});

		return answer ? PrismaAnswerMapper.toDomain(answer) : null;
	}
	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = await this.prisma.answer.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				questionId,
			},
			take: 20,
			skip: 20 * (page - 1),
		});

		return answers.map((item) => PrismaAnswerMapper.toDomain(item));
	}
	async save(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await this.prisma.answer.update({
			data,
			where: {
				id: data.id,
			},
		});
	}
	async delete(answer: Answer): Promise<void> {
		await this.prisma.answer.delete({
			where: {
				id: answer.id.toString(),
			},
		});
	}
}
