import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { ListQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/list-question-comments';
import { CommentPresenter } from '../presenters/comment-presenter';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('questions')
export class FetchQuestionCommentsController {
	constructor(
		private readonly listQuestionAnswersUseCase: ListQuestionCommentsUseCase,
	) {}

	@Get(':questionId/comments')
	async handle(
		@Param('questionId') questionId: string,
		@Query('page', queryValidationPipe) page: PageQueryParamSchema,
	) {
		const result = await this.listQuestionAnswersUseCase.execute({
			page,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const questionComments = result.value.questionComments;

		return {
			comments: questionComments.map(CommentPresenter.toHttp),
		};
	}
}
