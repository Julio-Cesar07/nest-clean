import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository';
import { UploadAndCreateAttachmentUseCase } from '../upload-and-create-attachment';
import { FakeUploader } from 'test/storage/faker-uploader';
import { InvalidAttachmentType } from '../errors/invalid-attachment-type-error';

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakerUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and Create Attachment', () => {
	beforeEach(() => {
		inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
		fakerUploader = new FakeUploader();
		sut = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentRepository,
			fakerUploader,
		);
	});
	it('should be able to upload and create an attachment', async () => {
		const result = await sut.execute({
			body: Buffer.from(''),
			fileName: 'profile.jpeg',
			fileType: 'image/jpeg',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentRepository.items[0],
		});
		expect(fakerUploader.storage).toHaveLength(1);
		expect(fakerUploader.storage[0]).toEqual(
			expect.objectContaining({
				fileName: 'profile.jpeg',
			}),
		);
	});
	it('should not be able to upload an attachment with invalid file type', async () => {
		const result = await sut.execute({
			body: Buffer.from(''),
			fileName: 'profile.mp3',
			fileType: 'audio/mp3',
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(InvalidAttachmentType);
	});
});
