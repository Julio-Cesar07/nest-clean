import {
	UploadParams,
	Uploader,
} from '@/domain/forum/application/storage/uploader';
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { EnvService } from '../env/env.service';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2Storage implements Uploader {
	private client: S3Client;

	constructor(private envService: EnvService) {
		const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');

		this.client = new S3Client({
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			region: 'auto',
			credentials: {
				accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
				secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
			},
		});
	}

	async upload({
		body,
		fileName,
		fileType,
	}: UploadParams): Promise<{ url: string }> {
		const uploadId = randomUUID();
		const uniqueFileName = `${uploadId}-${fileName}`;

		await this.client.send(
			new PutObjectCommand({
				Bucket: this.envService.get('AWS_BUCKET_NAME'),
				Key: uniqueFileName,
				ContentType: fileType,
				Body: body,
			}),
		);

		const url = await getSignedUrl(
			this.client,
			new GetObjectCommand({
				Bucket: this.envService.get('AWS_BUCKET_NAME'),
				Key: uniqueFileName,
			}),
			{ expiresIn: 3600 },
		);

		console.log(url);

		return {
			url: uniqueFileName,
		};
	}
}
