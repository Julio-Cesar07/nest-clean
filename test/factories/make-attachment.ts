import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Attachment,
	AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment';
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAttachment(
	override: Partial<AttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const attachment = Attachment.create(
		{
			title: faker.image.avatar(),
			url: faker.image.url(),
			...override,
		},
		id,
	);

	return attachment;
}

@Injectable()
export class AttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAttachment(
		override: Partial<AttachmentProps> = {},
		id?: UniqueEntityId,
	) {
		const attachment = makeAttachment(override, id);
		const data = PrismaAttachmentMapper.toPrisma(attachment);

		await this.prisma.attachment.create({
			data,
		});

		return attachment;
	}
}
