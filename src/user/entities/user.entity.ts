import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Record } from '../../record/entities/record.entity';

export enum UserStatusEnum {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Column({ enum: UserStatusEnum })
  status: UserStatusEnum;

  @OneToMany(() => Record, (record) => record.user)
  records: Record[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    // conditional to detect if password has changed goes here
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  checkPassword = (attempt) => {
    return bcrypt.compareSync(attempt, this.password);
  };
}
