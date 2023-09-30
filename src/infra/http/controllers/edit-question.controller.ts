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
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller('questions')
export class EditQuestionController {
	constructor(private readonly editQuestionUseCase: EditQuestionUseCase) {}

	@Put(':id')
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@Param('id') questionId: string,
	) {
		const { content, title } = body;
		const { sub: userId } = user;

		const result = await this.editQuestionUseCase.execute({
			title,
			attachmentsIds: [],
			authorId: userId,
			content,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
