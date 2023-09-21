import { Controller, Get, Post, Body } from '@nestjs/common';
import { OperationService } from './operation.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { DatatableController } from '../common/datatable.controller';
import { Operation } from './entities/operation.entity';

@Controller('operation')
export class OperationController extends DatatableController<Operation> {
  constructor(private readonly operationService: OperationService) {
    super(operationService);
  }
  @Post()
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationService.create(createOperationDto);
  }

  @Get()
  findAll() {
    return this.operationService.findAll();
  }
}
