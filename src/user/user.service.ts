import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatusEnum } from './entities/user.entity';
import { UserErrors } from '../util/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationService } from '../operation/operation.service';
import { RecordService } from '../record/record.service';
import { OperateDto } from './dto/operate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private operationService: OperationService,
    private recordService: RecordService,
  ) {}

  async create(user: CreateUserDto) {
    const existUser = await this.repository.findOne({
      where: { username: user.username },
    });
    if (existUser) {
      throw new Error('Already exist user with this username');
    }

    const createdUser = this.repository.create(user);
    createdUser.status = UserStatusEnum.ACTIVE;
    return createdUser.save();
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async findOneByUsername(username): Promise<User> {
    return await this.repository.findOneOrFail({
      where: { username, status: UserStatusEnum.ACTIVE },
    });
  }

  async getBalanceById(userId: string) {
    if (!userId) {
      throw new Error(UserErrors.USER_BALANCE_ID_REQUIRED);
    }

    return this.recordService.getBalanceByUserId(userId);
  }

  async operate(operateDto: OperateDto) {
    const { type, args, userId } = operateDto;
    const balanceAndAmount = await this.getBalanceAndAmount(type, userId);
    if (!balanceAndAmount) {
      throw new Error(UserErrors.INSUFFICIENT_BALANCE);
    }
    const result = await this.operationService[type](args);
    try {
      const record = await this.recordService.create({
        operation: type,
        operationResponse: result.toString(),
        userBalance: balanceAndAmount.balance,
        amount: balanceAndAmount.amount,
        userId,
      });
      return record;
    } catch (e) {
      throw e;
    }
  }

  private async getBalanceAndAmount(type, userId) {
    try {
      const { cost } = await this.operationService.findOneByType(type);
      const balance = await this.getBalanceById(userId);
      if (balance >= cost) {
        return { balance: balance - cost, amount: cost };
      }
      return;
    } catch (error) {
      return;
    }
  }
}
