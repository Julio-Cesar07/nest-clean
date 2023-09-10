import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComments, AnswerCommentsProps } from '@/domain/forum/enterprise/entities/answer-comment';
import { faker } from '@faker-js/faker';

export function makeAnswerComment(
	override: Partial<AnswerCommentsProps> = {},
	id?: UniqueEntityId
) {
	const answerComment = AnswerComments.create({
		answerId: new UniqueEntityId(),
		authorId: new UniqueEntityId(),
		content: faker.lorem.text(),
		...override,
	},
	id,
	);

	return answerComment;
}