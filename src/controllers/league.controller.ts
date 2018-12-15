import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {League} from '../models';
import {LeagueRepository} from '../repositories';

export class LeagueController {
  constructor(
    @repository(LeagueRepository)
    public leagueRepository : LeagueRepository,
  ) {}

  @post('/leagues', {
    responses: {
      '200': {
        description: 'League model instance',
        content: {'application/json': {schema: {'x-ts-type': League}}},
      },
    },
  })
  async create(@requestBody() league: League): Promise<League> {
    return await this.leagueRepository.create(league);
  }

  @get('/leagues/count', {
    responses: {
      '200': {
        description: 'League model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(League)) where?: Where,
  ): Promise<Count> {
    return await this.leagueRepository.count(where);
  }

  @get('/leagues', {
    responses: {
      '200': {
        description: 'Array of League model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': League}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(League)) filter?: Filter,
  ): Promise<League[]> {
    return await this.leagueRepository.find(filter);
  }

  @patch('/leagues', {
    responses: {
      '200': {
        description: 'League PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() league: League,
    @param.query.object('where', getWhereSchemaFor(League)) where?: Where,
  ): Promise<Count> {
    return await this.leagueRepository.updateAll(league, where);
  }

  @get('/leagues/{id}', {
    responses: {
      '200': {
        description: 'League model instance',
        content: {'application/json': {schema: {'x-ts-type': League}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<League> {
    return await this.leagueRepository.findById(id);
  }

  @patch('/leagues/{id}', {
    responses: {
      '204': {
        description: 'League PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() league: League,
  ): Promise<void> {
    await this.leagueRepository.updateById(id, league);
  }

  @put('/leagues/{id}', {
    responses: {
      '204': {
        description: 'League PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() league: League,
  ): Promise<void> {
    await this.leagueRepository.replaceById(id, league);
  }

  @del('/leagues/{id}', {
    responses: {
      '204': {
        description: 'League DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.leagueRepository.deleteById(id);
  }
}
