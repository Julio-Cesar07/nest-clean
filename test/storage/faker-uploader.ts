import {
	UploadParams,
	Uploader,
} from '@/domain/forum/application/storage/uploader';
import { randomUUID } from 'crypto';

interface Upload {
	fileName: string;
	url: string;
}

export class FakeUploader implements Uploader {
	public storage: Upload[] = [];

	async upload({ fileName }: UploadParams): Promise<{ url: string }> {
		const url = randomUUID() + '/' + fileName;

		this.storage.push({
			fileName,
			url,
		});

		return {
			url,
		};
	}
}
