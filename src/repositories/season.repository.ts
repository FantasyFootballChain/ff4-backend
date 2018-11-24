import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Season} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SeasonRepository extends DefaultCrudRepository<
  Season,
  typeof Season.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Season, dataSource);
  }
}
