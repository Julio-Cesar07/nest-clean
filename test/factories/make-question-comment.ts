import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	QuestionComments,
	QuestionCommentsProps,
} from '@/domain/forum/enterprise/entities/question-comment';
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeQuestionComment(
	override: Partial<QuestionCommentsProps> = {},
	id?: UniqueEntityId,
) {
	const questionComment = QuestionComments.create(
		{
			questionId: new UniqueEntityId(),
			authorId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionComment(
		data: Partial<QuestionCommentsProps> = {},
	): Promise<QuestionComments> {
		const questioncomment = makeQuestionComment(data);

		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPrisma(questioncomment),
		});

		return questioncomment;
	}
}
