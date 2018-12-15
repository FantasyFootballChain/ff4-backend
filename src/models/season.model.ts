import { Entity, model, property } from '@loopback/repository';

@model({ name: 'season' })
export class Season extends Entity {
	@property({
		type: 'number',
		id: true,
	})
	id?: number;

	@property({
		type: 'string',
		required: true,
	})
	name: string;

	constructor(data?: Partial<Season>) {
		super(data);
	}
}
