import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Record } from '../record/entities/record.entity';
import { Operation } from '../operation/entities/operation.entity';
import { OperationService } from '../operation/operation.service';
import { RecordService } from '../record/record.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Record, Operation]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [UserController],
  providers: [UserService, OperationService, RecordService],
  exports: [UserService],
})
export class UserModule {}
