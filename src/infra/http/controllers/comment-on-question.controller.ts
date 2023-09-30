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
import { CommentOnQuestioUseCase } from '@/domain/forum/application/use-cases/comment-on-question';

const commentOnQuestionBodySchema = z.object({
	content: z.string(),
});

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

@Controller('questions')
export class CommentOnQuestionController {
	constructor(private readonly commentOnQuestion: CommentOnQuestioUseCase) {}

	@Post(':questionId/comments')
	@HttpCode(201)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
		@Param('questionId') questionId: string,
	) {
		const { content } = body;
		const { sub: userId } = user;

		const result = await this.commentOnQuestion.execute({
			authorId: userId,
			content,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
