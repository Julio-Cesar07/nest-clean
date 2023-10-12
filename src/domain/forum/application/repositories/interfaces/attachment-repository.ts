import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export abstract class AttachmentRepository {
	abstract create(attachment: Attachment): Promise<void>;
}
