import { OperationEnum } from '../../operation/entities/operation.entity';

export class CreateRecordDto {
  userId: string;
  userBalance: number;
  amount: number;
  operationResponse: string;
  operation: OperationEnum;
}
