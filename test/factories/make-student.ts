import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Student,
	StudentProps,
} from '@/domain/forum/enterprise/entities/student';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
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
			password: await fakeHasher.hash(faker.internet.password()),
			...override,
		},
		id,
	);

	return student;
}

@Injectable()
export class StudentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
		const student = await makeStudent(data);

		await this.prisma.user.create({
			data: PrismaStudentMapper.toPrisma(student),
		});

		return student;
	}
}
