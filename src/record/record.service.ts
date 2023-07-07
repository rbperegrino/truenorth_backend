import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { DatatableService } from '../common/datatable.service';

@Injectable()
export class RecordService extends DatatableService<Record> {
  constructor(
    @InjectRepository(Record) private recordRepository: Repository<Record>,
  ) {
    super(recordRepository);
  }
  async create(createRecordDto: CreateRecordDto) {
    const record = await this.recordRepository.create(createRecordDto);
    record.operation = createRecordDto.operation;
    return record.save();
  }

  findAll() {
    return this.recordRepository.find();
  }

  findOne(id: string) {
    return this.recordRepository.findOneBy({ id });
  }

  remove(id: string) {
    return this.recordRepository.softDelete(id);
  }

  async getBalanceByUserId(userId: string) {
    const { userBalance } = (await this.recordRepository.findOne({
      select: { userBalance: true },
      where: { userId },
      order: { date: 'DESC' },
    })) || { userBalance: 100 };

    return userBalance;
  }
}
