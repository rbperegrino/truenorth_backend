import { Repository, FindManyOptions, ILike } from 'typeorm';
import { User } from '../user/entities/user.entity';

export interface IDatatable<T> {
  data: T[];
  count: number;
}

export interface IPaginationData {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}

export interface IPagination<T> {
  pagination: IPaginationData;
  data: T[];
}

export class DatatableService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async pagination(
    user: User,
    order: 'asc' | 'desc' = 'asc',
    take?: number,
    skip?: number,
    sort?: string,
    search?: string,
    relation?: string,
  ): Promise<IPagination<T>> {
    const conditions: FindManyOptions<T> = {};
    conditions.where = {};
    conditions.where['userId'] = user.id;
    if (take) {
      conditions.take = take;
    }

    if (skip) {
      conditions.skip = skip * take;
    }

    if (order && sort) {
      conditions.order = {};
      if (sort.indexOf('.') < 0) {
        conditions.order[sort] = order;
      } else {
        const sortRelation = sort.split('.');

        conditions.order[sortRelation[0]] = { [sortRelation[1]]: order };

        conditions.order['name'] = 'asc';
      }
    }

    if (search) {
      conditions.where['name'] = ILike('%' + search + '%');
    }

    if (relation) {
      const arr = relation.split(':');

      conditions.where[arr[0]] = arr[1];
    }

    const [result, total] = await this.repository.findAndCount(conditions);

    // Calculate pagination details
    const begin = skip * take;
    const end = Math.min(take * (skip + 1), total);
    const lastPage = Math.max(Math.ceil(total / take), 1);

    return {
      data: result,
      pagination: {
        page: skip,
        length: total,
        endIndex: end - 1,
        lastPage: lastPage,
        size: take,
        startIndex: begin,
      },
    };
  }
}
