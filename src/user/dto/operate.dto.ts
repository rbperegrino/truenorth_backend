import { OperationEnum } from '../../operation/entities/operation.entity';

export class OperateDto {
  type: OperationEnum;
  userId?: string;
  args?: number[];
}
