import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { HttpModule } from '@nestjs/axios';
import { Operation } from './entities/operation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Operation]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [OperationController],
  providers: [OperationService],
})
export class OperationModule {}
