import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Answer as RawAnswer, Prisma } from '@prisma/client';

export class PrismaAnswerMapper {
	static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
		return {
			authorId: answer.authorId.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			id: answer.id.toString(),
			updatedAt: answer.updatedAt,
			questionId: answer.questionId.toString(),
		};
	}

	static toDomain(raw: RawAnswer): Answer {
		return Answer.create(
			{
				authorId: new UniqueEntityId(raw.authorId),
				content: raw.content,
				updatedAt: raw.updatedAt,
				createdAt: raw.createdAt,
				questionId: new UniqueEntityId(raw.questionId),
			},
			new UniqueEntityId(raw.id),
		);
	}
}
