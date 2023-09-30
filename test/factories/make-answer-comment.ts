import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	AnswerComments,
	AnswerCommentsProps,
} from '@/domain/forum/enterprise/entities/answer-comment';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAnswerComment(
	override: Partial<AnswerCommentsProps> = {},
	id?: UniqueEntityId,
) {
	const answerComment = AnswerComments.create(
		{
			answerId: new UniqueEntityId(),
			authorId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswerComment(
		data: Partial<AnswerCommentsProps> = {},
	): Promise<AnswerComments> {
		const answerComment = makeAnswerComment(data);

		await this.prisma.comment.create({
			data: PrismaAnswerCommentMapper.toPrisma(answerComment),
		});

		return answerComment;
	}
}
