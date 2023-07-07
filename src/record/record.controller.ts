import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { DatatableController } from '../common/datatable.controller';
import { Record } from './entities/record.entity';

@Controller('record')
export class RecordController extends DatatableController<Record> {
  constructor(private readonly recordService: RecordService) {
    super(recordService);
  }

  @Post()
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordService.create(createRecordDto);
  }

  @Get()
  findAll() {
    return this.recordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(id);
  }
}
