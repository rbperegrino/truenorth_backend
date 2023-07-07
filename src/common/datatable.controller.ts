import { DatatableService, IPagination } from './datatable.service';
import { Get, UseGuards, Query, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class DatatableController<T> {
  constructor(private readonly service: DatatableService<T>) {}

  @Get('pagination')
  @UseGuards(AuthGuard())
  async pagination(
    @Req() req,
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('relation') relation?: string,
  ): Promise<IPagination<T>> {
    return this.service.pagination(
      req.user.user,
      order,
      take,
      skip,
      sort,
      search,
      relation,
    );
  }
}
