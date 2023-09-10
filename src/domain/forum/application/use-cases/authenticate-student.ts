import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/interfaces/student-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrond-credentials-error';

interface AuthenticateStudentUseCaseRequest {
	email: string;
	password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
	WrongCredentialsError,
	{
		accessToken: string;
	}
>;

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private studentRepository: StudentRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentRepository.findByEmail(email);

		if (!student) return left(new WrongCredentialsError());

		const isPasswordValid = await this.hashComparer.compare(
			password,
			student.password,
		);

		if (!isPasswordValid) return left(new WrongCredentialsError());

		const accessToken = await this.encrypter.encrypt({
			sub: student.id.toString(),
		});

		return right({ accessToken });
	}
}
