import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { QuestionPresenter } from '../presenters/question-presenter';
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('questions')
export class FetchRecentQuestionsController {
	constructor(
		private readonly listRecentQuestionUseCase: ListRecentQuestionsUseCase,
	) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
		const result = await this.listRecentQuestionUseCase.execute({
			page,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const questions = result.value.questions;

		return {
			questions: questions.map(QuestionPresenter.toHttp),
		};
	}
}
