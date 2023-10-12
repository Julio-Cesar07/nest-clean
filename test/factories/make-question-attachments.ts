import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	QuestionAttachment,
	QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeQuestionAttachments(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const questionAttachments = QuestionAttachment.create(
		{
			attachmentId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return questionAttachments;
}

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionAttachment(
		data: Partial<QuestionAttachmentProps> = {},
		id?: UniqueEntityId,
	): Promise<QuestionAttachment> {
		const questionAttachment = makeQuestionAttachments(data, id);

		await this.prisma.attachment.update({
			where: {
				id: questionAttachment.attachmentId.toString(),
			},
			data: {
				questionId: questionAttachment.questionId.toString(),
			},
		});

		return questionAttachment;
	}
}
