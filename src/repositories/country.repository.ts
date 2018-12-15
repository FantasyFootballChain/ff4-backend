import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Country} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CountryRepository extends DefaultCrudRepository<
  Country,
  typeof Country.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Country, dataSource);
  }
}
