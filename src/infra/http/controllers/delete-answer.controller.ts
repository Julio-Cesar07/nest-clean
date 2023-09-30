import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';

@Controller('answers')
export class DeleteAnswerController {
	constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

	@Delete(':id')
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('id') answerId: string,
	) {
		const { sub: userId } = user;

		const result = await this.deleteAnswer.execute({
			authorId: userId,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
