import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {League} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LeagueRepository extends DefaultCrudRepository<
  League,
  typeof League.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(League, dataSource);
  }
}
