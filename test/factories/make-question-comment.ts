import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionComments, QuestionCommentsProps } from '@/domain/forum/enterprise/entities/question-comment';
import { faker } from '@faker-js/faker';

export function makeQuestionComment(
	override: Partial<QuestionCommentsProps> = {},
	id?: UniqueEntityId
) {
	const questionComment = QuestionComments.create({
		questionId: new UniqueEntityId(),
		authorId: new UniqueEntityId(),
		content: faker.lorem.text(),
		...override,
	},
	id,
	);

	return questionComment;
}