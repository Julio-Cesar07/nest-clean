import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comment';
import { Comment as PrismaComment, Prisma } from '@prisma/client';

export class PrismaAnswerCommentMapper {
	static toPrisma(
		answerComment: AnswerComments,
	): Prisma.CommentUncheckedCreateInput {
		return {
			authorId: answerComment.authorId.toString(),
			content: answerComment.content,
			createdAt: answerComment.createdAt,
			id: answerComment.id.toString(),
			updatedAt: answerComment.updatedAt,
			answerId: answerComment.answerId.toString(),
		};
	}

	static toDomain(raw: PrismaComment): AnswerComments {
		if (!raw.answerId) throw new Error('Invalid comment type.');

		return AnswerComments.create(
			{
				authorId: new UniqueEntityId(raw.authorId),
				answerId: new UniqueEntityId(raw.answerId),
				content: raw.content,
				updatedAt: raw.updatedAt,
				createdAt: raw.createdAt,
			},
			new UniqueEntityId(raw.id),
		);
	}
}
