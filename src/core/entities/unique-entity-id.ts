import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
	private value: string;

	constructor(value?: string) {
		this.value = value ?? randomUUID();
	}

	equals(id: UniqueEntityId) {
		return id.toValue() === this.value;
	}

	toString() {
		return this.value;
	}

	toValue() {
		return this.value;
	}
}
