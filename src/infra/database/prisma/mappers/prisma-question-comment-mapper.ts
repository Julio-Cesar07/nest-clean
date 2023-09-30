import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comment';
import { Comment as PrismaComment, Prisma } from '@prisma/client';

export class PrismaQuestionCommentMapper {
	static toPrisma(
		questionComment: QuestionComments,
	): Prisma.CommentUncheckedCreateInput {
		return {
			authorId: questionComment.authorId.toString(),
			content: questionComment.content,
			createdAt: questionComment.createdAt,
			id: questionComment.id.toString(),
			updatedAt: questionComment.updatedAt,
			questionId: questionComment.questionId.toString(),
		};
	}

	static toDomain(raw: PrismaComment): QuestionComments {
		if (!raw.questionId) throw new Error('Invalid comment type.');

		return QuestionComments.create(
			{
				authorId: new UniqueEntityId(raw.authorId),
				questionId: new UniqueEntityId(raw.questionId),
				content: raw.content,
				updatedAt: raw.updatedAt,
				createdAt: raw.createdAt,
			},
			new UniqueEntityId(raw.id),
		);
	}
}
