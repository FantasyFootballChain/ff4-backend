import { Entity, model, property } from '@loopback/repository';

@model({ name: 'league' })
export class League extends Entity {
	@property({
		type: 'number',
		id: true,
	})
	id?: number;

	@property({
		type: 'number',
		required: true,
	})
	season_id: number;

	@property({
		type: 'number',
		required: true,
	})
	country_id: number;

	constructor(data?: Partial<League>) {
		super(data);
	}
}
