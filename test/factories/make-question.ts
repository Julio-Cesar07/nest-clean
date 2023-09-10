import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { faker } from '@faker-js/faker';

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityId
) {
	const question = Question.create({
		title: faker.lorem.sentence(),
		authorId: new UniqueEntityId(),
		content: faker.lorem.text(),
		...override,
	},
	id,
	);

	return question;
}