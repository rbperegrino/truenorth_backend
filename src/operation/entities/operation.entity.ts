import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum OperationEnum {
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
  SQUARE_ROOT = 'square_root',
  RANDOM_STRING = 'random_string',
}

@Entity()
export class Operation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OperationEnum,
    default: OperationEnum.ADDITION,
  })
  type: OperationEnum;

  @Column()
  cost: number;
}
