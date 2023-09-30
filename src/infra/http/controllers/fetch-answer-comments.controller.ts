import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { ListAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/list-answer-comments';
import { CommentPresenter } from '../presenters/comment-presenter';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('answers')
export class FetchAnswerCommentsController {
	constructor(
		private readonly listAnswerAnswersUseCase: ListAnswerCommentsUseCase,
	) {}

	@Get(':answerId/comments')
	async handle(
		@Param('answerId') answerId: string,
		@Query('page', queryValidationPipe) page: PageQueryParamSchema,
	) {
		const result = await this.listAnswerAnswersUseCase.execute({
			page,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const answerComments = result.value.answerComments;

		return {
			comments: answerComments.map(CommentPresenter.toHttp),
		};
	}
}
