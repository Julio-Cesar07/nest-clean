import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Comment, CommentProps } from './comment';

export interface QuestionCommentsProps extends CommentProps {
	questionId: UniqueEntityId;
}

export class QuestionComments extends Comment<QuestionCommentsProps> {
	static create(
		props: Optional<QuestionCommentsProps, 'createdAt'>,
		id?: UniqueEntityId
	) {
		const questionComment = new QuestionComments(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return questionComment;
	}

	get questionId() {
		return this.props.questionId;
	}
}
