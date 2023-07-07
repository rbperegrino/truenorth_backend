import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
