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
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller('answers')
export class CommentOnAnswerController {
	constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post(':answerId/comments')
	@HttpCode(201)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
		@Param('answerId') answerId: string,
	) {
		const { content } = body;
		const { sub: userId } = user;

		const result = await this.commentOnAnswer.execute({
			authorId: userId,
			content,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
