import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const editAnswerBodySchema = z.object({
	content: z.string(),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

@Controller('answers')
export class EditAnswerController {
	constructor(private readonly editAnswerUseCase: EditAnswerUseCase) {}

	@Put(':id')
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: EditAnswerBodySchema,
		@Param('id') answerId: string,
	) {
		const { content } = body;
		const { sub: userId } = user;

		const result = await this.editAnswerUseCase.execute({
			attachmentsIds: [],
			authorId: userId,
			content,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
