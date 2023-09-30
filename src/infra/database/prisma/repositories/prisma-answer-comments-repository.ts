import { PaginationParams } from '@/core/repositories/pagination-params';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/interfaces/answer-comments-repository';
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comment';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private prisma: PrismaService) {}

	async create(answerComments: AnswerComments): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPrisma(answerComments);
		await this.prisma.comment.create({
			data,
		});
	}
	async findById(answerCommentsId: string): Promise<AnswerComments | null> {
		const answerComment = await this.prisma.comment.findUnique({
			where: {
				id: answerCommentsId,
			},
		});

		return answerComment
			? PrismaAnswerCommentMapper.toDomain(answerComment)
			: null;
	}
	async findManyByAnswerId(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<AnswerComments[]> {
		const answerComments = await this.prisma.comment.findMany({
			where: {
				answerId,
			},
			skip: (page - 1) * 20,
			take: 20,
		});

		return answerComments.map(PrismaAnswerCommentMapper.toDomain);
	}
	async delete(answerComments: AnswerComments): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: answerComments.id.toString(),
			},
		});
	}
}
