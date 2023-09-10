import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Student,
	StudentProps,
} from '@/domain/forum/enterprise/entities/student';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';

export async function makeStudent(
	override: Partial<StudentProps> = {},
	id?: UniqueEntityId,
) {
	const fakeHasher = new FakeHasher();
	const student = Student.create(
		{
			email: faker.internet.email(),
			name: faker.person.firstName(),
			...override,
			password: await fakeHasher.hash(
				override.password ?? faker.internet.password(),
			),
		},
		id,
	);

	return student;
}
