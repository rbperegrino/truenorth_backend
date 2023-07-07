import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { Operation, OperationEnum } from './entities/operation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom, map } from 'rxjs';
import { DatatableService } from '../common/datatable.service';

type OperationServiceInterface = {
  [key in OperationEnum]: (args?: number[]) => Promise<number | string>;
};

@Injectable()
export class OperationService
  extends DatatableService<Operation>
  implements OperationServiceInterface
{
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    private http: HttpService,
  ) {
    super(operationRepository);
  }

  create(createOperationDto: CreateOperationDto) {
    return 'This action adds a new operation';
  }

  findAll() {
    return this.operationRepository.find({ order: { type: 'ASC' } });
  }

  findOne(id: number) {
    return `This action returns a #${id} operation`;
  }

  update(id: number, updateOperationDto: UpdateOperationDto) {
    return `This action updates a #${id} operation`;
  }

  remove(id: number) {
    return `This action removes a #${id} operation`;
  }

  findOneByType(type: OperationEnum) {
    return this.operationRepository.findOneBy({ type });
  }

  async [OperationEnum.ADDITION](args) {
    const [a, b] = args;
    return a + b;
  }

  async [OperationEnum.SUBTRACTION](args) {
    const [a, b] = args;
    return a - b;
  }

  async [OperationEnum.MULTIPLICATION](args) {
    const [a, b] = args;
    return a * b;
  }

  async [OperationEnum.DIVISION](args) {
    const [a, b] = args;
    return a / b;
  }

  async [OperationEnum.SQUARE_ROOT](args: number[]) {
    const [a] = args;
    return Math.sqrt(a);
  }

  async [OperationEnum.RANDOM_STRING]() {
    return this.randomString();
  }

  private async randomString() {
    return await firstValueFrom(
      this.http
        .get(
          'https://www.random.org/strings/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new',
        )
        .pipe(map((a) => a.data.replace('\n', ''))),
    );
  }
}
