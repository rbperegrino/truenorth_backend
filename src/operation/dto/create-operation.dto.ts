import { OperationEnum } from '../entities/operation.entity';

export class CreateOperationDto {
  type: OperationEnum;
  cost: number;
}
