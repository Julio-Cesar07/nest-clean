import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/interfaces/question-comments-repository';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private prisma: PrismaService) {}

	async create(questionComments: QuestionComments): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPrisma(questionComments);
		await this.prisma.comment.create({
			data,
		});
	}
	async findById(questionCommentsId: string): Promise<QuestionComments | null> {
		const questionComment = await this.prisma.comment.findUnique({
			where: {
				id: questionCommentsId,
			},
		});

		return questionComment
			? PrismaQuestionCommentMapper.toDomain(questionComment)
			: null;
	}
	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComments[]> {
		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
			skip: (page - 1) * 20,
			take: 20,
		});

		return questionComments.map(PrismaQuestionCommentMapper.toDomain);
	}
	async delete(questionComments: QuestionComments): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: questionComments.id.toString(),
			},
		});
	}
}
