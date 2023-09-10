import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { Question as RawQuestion, Prisma } from '@prisma/client';

export class PrismaQuestionMapper {
	static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
		return {
			authorId: question.authorId.toString(),
			bestAnswerId: question.bestAnswerId
				? question.bestAnswerId.toString()
				: null,
			content: question.content,
			createdAt: question.createdAt,
			id: question.id.toString(),
			slug: question.slug.value,
			title: question.title,
			updatedAt: question.updatedAt,
		};
	}

	static toDomain(raw: RawQuestion): Question {
		return Question.create(
			{
				authorId: new UniqueEntityId(raw.authorId),
				content: raw.content,
				title: raw.title,
				slug: Slug.create(raw.slug),
				updatedAt: raw.updatedAt,
				bestAnswerId: raw.bestAnswerId
					? new UniqueEntityId(raw.bestAnswerId)
					: null,
				createdAt: raw.createdAt,
			},
			new UniqueEntityId(raw.id),
		);
	}
}
