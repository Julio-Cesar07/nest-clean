import { Slug } from './slug';

it('should be able to create a new slug from text', async () => {
	const slug = Slug.createFromText(' Example question_title- ');

	expect(slug.value).toEqual('example-question-title');
});
