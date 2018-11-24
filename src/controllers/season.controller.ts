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
  del,
  requestBody,
} from '@loopback/rest';
import {Season} from '../models';
import {SeasonRepository} from '../repositories';

export class SeasonController {
  constructor(
    @repository(SeasonRepository)
    public seasonRepository : SeasonRepository,
  ) {}

  @post('/seasons', {
    responses: {
      '200': {
        description: 'Season model instance',
        content: {'application/json': {schema: {'x-ts-type': Season}}},
      },
    },
  })
  async create(@requestBody() season: Season): Promise<Season> {
    return await this.seasonRepository.create(season);
  }

  @get('/seasons/count', {
    responses: {
      '200': {
        description: 'Season model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Season)) where?: Where,
  ): Promise<Count> {
    return await this.seasonRepository.count(where);
  }

  @get('/seasons', {
    responses: {
      '200': {
        description: 'Array of Season model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Season}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Season)) filter?: Filter,
  ): Promise<Season[]> {
    return await this.seasonRepository.find(filter);
  }

  @patch('/seasons', {
    responses: {
      '200': {
        description: 'Season PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() season: Season,
    @param.query.object('where', getWhereSchemaFor(Season)) where?: Where,
  ): Promise<Count> {
    return await this.seasonRepository.updateAll(season, where);
  }

  @get('/seasons/{id}', {
    responses: {
      '200': {
        description: 'Season model instance',
        content: {'application/json': {schema: {'x-ts-type': Season}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Season> {
    return await this.seasonRepository.findById(id);
  }

  @patch('/seasons/{id}', {
    responses: {
      '204': {
        description: 'Season PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() season: Season,
  ): Promise<void> {
    await this.seasonRepository.updateById(id, season);
  }

  @del('/seasons/{id}', {
    responses: {
      '204': {
        description: 'Season DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.seasonRepository.deleteById(id);
  }
}
