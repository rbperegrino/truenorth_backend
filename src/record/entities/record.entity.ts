import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import {
  Operation,
  OperationEnum,
} from '../../operation/entities/operation.entity';

const OperationLabel = new Map([
  ['addition', 'Addition'],
  ['subtraction', 'Subtraction'],
  ['division', 'Division'],
  ['multiplication', 'Multiplication'],
  ['square_root', 'Square Root'],
  ['random_string', 'Random String'],
]);

@Entity()
export class Record extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'operation_id' })
  operationId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  amount: number;

  @Column({ name: 'user_balance' })
  userBalance: number;

  @Column({ name: 'operation_response' })
  operationResponse: string;

  @Column()
  name: string;

  @CreateDateColumn()
  date: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: string;

  @ManyToOne(() => User, (user) => user.records)
  user: User;

  operation: OperationEnum;

  @BeforeInsert()
  async getOperationId() {
    const { id, type } = await Operation.findOneBy({ type: this.operation });
    this.operationId = id;
    this.name = OperationLabel.get(type);
  }
}
