import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Prisma, User as RawUser } from '@prisma/client';

export class PrismaStudentMapper {
	static toDomain(raw: RawUser): Student {
		return Student.create(
			{
				email: raw.email,
				name: raw.name,
				password: raw.password,
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
		return {
			email: student.email,
			name: student.name,
			password: student.password,
			id: student.id.toString(),
		};
	}
}
