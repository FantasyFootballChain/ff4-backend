import { Entity, model, property } from '@loopback/repository';

@model({ name: 'country' })
export class Country extends Entity {
	@property({
		type: 'number',
		id: true,
	})
	id?: number;

	@property({
		type: 'string',
	})
	flag_svg?: string;

	@property({
		type: 'string',
	})
	short_name?: string;

	@property({
		type: 'string',
	})
	full_name?: string;

	constructor(data?: Partial<Country>) {
		super(data);
	}
}
