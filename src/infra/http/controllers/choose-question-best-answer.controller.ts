import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	Patch,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';

@Controller('answers')
export class ChooseQuestionBestAnswerController {
	constructor(
		private readonly chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
	) {}

	@Patch(':answerId/choose-as-best')
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('answerId') answerId: string,
	) {
		const { sub: userId } = user;

		const result = await this.chooseQuestionBestAnswerUseCase.execute({
			authorId: userId,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
