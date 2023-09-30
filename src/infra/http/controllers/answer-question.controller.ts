import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';

const answerQuestionBodySchema = z.object({
	content: z.string(),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller('questions')
export class AnswerQuestionController {
	constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

	@Post(':questionId/answers')
	@HttpCode(201)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@Param('questionId') questionId: string,
	) {
		const { content } = body;
		const { sub: userId } = user;

		const result = await this.answerQuestion.execute({
			content,
			authorId: userId,
			questionId,
			attachmentsIds: [],
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
