import { Test, TestingModule } from '@nestjs/testing';
import { OperationService } from './operation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { HttpService } from '@nestjs/axios';
import { repositoryMockFactory } from '../../test/utils';

describe('OperationService', () => {
  let service: OperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationService,
        {
          provide: getRepositoryToken(Operation),
          useFactory: repositoryMockFactory,
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OperationService>(OperationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
