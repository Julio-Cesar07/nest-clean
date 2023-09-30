import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { ListQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/list-question-answer';
import { AnswerPresenter } from '../presenters/answer-presenter';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('questions')
export class FetchQuestionAnswersController {
	constructor(
		private readonly listQuestionAnswersUseCase: ListQuestionAnswersUseCase,
	) {}

	@Get(':questionId/answers')
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

		const answers = result.value.answers;

		return {
			answers: answers.map(AnswerPresenter.toHttp),
		};
	}
}
