import { InMemoryStudenteRepository } from 'test/repositories/in-memory-student-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateStudentUseCase } from '../authenticate-student';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentRepository: InMemoryStudenteRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('Authenticate student', () => {
	beforeEach(() => {
		inMemoryStudentRepository = new InMemoryStudenteRepository();
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();
		sut = new AuthenticateStudentUseCase(
			inMemoryStudentRepository,
			fakeHasher,
			fakeEncrypter,
		);
	});
	it('should be able to register a new student', async () => {
		inMemoryStudentRepository.create(
			await makeStudent({
				email: 'johndoe@example.com',
				password: '123456',
			}),
		);

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		});
	});
});
