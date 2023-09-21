import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateOperationDto } from './dto/create-operation.dto';
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
    try {
      const operation = this.operationRepository.create(createOperationDto);
      return operation.save();
    } catch (e) {
      console.log(e);
    }
  }

  findAll() {
    return this.operationRepository.find({ order: { type: 'ASC' } });
  }

  findOneByType(type: OperationEnum) {
    return this.operationRepository.findOneBy({ type });
  }

  async [OperationEnum.ADDITION](args) {
    const [a, b] = args;

    try {
      const numberA = Number(a);
      const numberB = Number(b);
      return numberA + numberB;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async [OperationEnum.SUBTRACTION](args: number[]) {
    const [a, b] = args;
    return a - b;
  }

  async [OperationEnum.MULTIPLICATION](args: number[]) {
    const [a, b] = args;
    return a * b;
  }

  async [OperationEnum.DIVISION](args: number[]) {
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
