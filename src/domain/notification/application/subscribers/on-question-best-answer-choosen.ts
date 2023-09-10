import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionBestAnswerChooseEvent } from '@/domain/forum/enterprise/events/question-best-answer-choose-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { AnswerRepository } from '@/domain/forum/application/repositories/interfaces/answers-repository';

export class OnQuestionBestAnswerChoosen implements EventHandler {
	constructor(
		private answerRepository: AnswerRepository,
		private sendNotificationUseCase: SendNotificationUseCase
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChooseEvent.name
		);
	}

	private async sendQuestionBestAnswerNotification({
		bestAnswerId,
		question,
	}: QuestionBestAnswerChooseEvent) {
		const answer = await this.answerRepository.findById(
			bestAnswerId.toString()
		);

		if (answer)
			await this.sendNotificationUseCase.execute({
				recipientId: answer.authorId.toString(),
				title: 'Sua resposta foi escolhida!',
				content: `A resposta que você enviou em "${question.title
					.substring(0, 20)
					.concat('...')}" foi escolhida pelo autor!`,
			});
	}
}
