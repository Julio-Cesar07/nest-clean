import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachmentsIds: z.array(z.string().uuid()),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('questions')
export class CreateQuestionController {
	constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
	) {
		const { content, title, attachmentsIds } = body;
		const { sub: userId } = user;

		const result = await this.createQuestionUseCase.execute({
			title,
			attachmentsIds,
			authorId: userId,
			content,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
