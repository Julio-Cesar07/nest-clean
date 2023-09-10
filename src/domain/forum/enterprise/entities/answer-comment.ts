import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Comment, CommentProps } from './comment';

export interface AnswerCommentsProps extends CommentProps {
	answerId: UniqueEntityId;
}

export class AnswerComments extends Comment<AnswerCommentsProps> {
	static create(
		props: Optional<AnswerCommentsProps, 'createdAt'>,
		id?: UniqueEntityId
	) {
		const answerComment = new AnswerComments(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return answerComment;
	}

	get answerId() {
		return this.props.answerId;
	}
}
