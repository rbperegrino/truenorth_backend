import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Record } from '../../record/entities/record.entity';
import { UserErrors } from '../../util/errors';
import {
  Operation,
  OperationEnum,
} from '../../operation/entities/operation.entity';
import { OperationService } from '../../operation/operation.service';
import { HttpService } from '@nestjs/axios';
import { User } from '../entities/user.entity';
import { repositoryMockFactory } from '../../../test/utils';
import { RecordService } from '../../record/record.service';

describe('UserService', () => {
  let service: UserService;
  let operationService: OperationService;
  let recordService: RecordService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        OperationService,
        RecordService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Record),
          useFactory: repositoryMockFactory,
        },
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

    service = module.get<UserService>(UserService);
    operationService = module.get<OperationService>(OperationService);
    recordService = module.get<RecordService>(RecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user balance specs', () => {
    it('should throw an error if user is not provided', () => {
      service
        .getBalanceById(undefined)
        .catch((error) =>
          expect(error.message).toBe(UserErrors.USER_BALANCE_ID_REQUIRED),
        );
    });

    it('should throw an error if user is not found', () => {
      jest
        .spyOn(recordService, 'getBalanceByUserId')
        .mockRejectedValueOnce(new Error(UserErrors.USER_BALANCE_NOT_FOUND));

      service
        .getBalanceById('abc')
        .catch((error) =>
          expect(error.message).toBe(UserErrors.USER_BALANCE_NOT_FOUND),
        );
    });
    it('should get the user balance', async () => {
      jest.spyOn(recordService, 'getBalanceByUserId').mockResolvedValueOnce(1);
      expect(await service.getBalanceById('abc')).toBe(1);
    });
  });

  describe('operation specs', () => {
    describe('canOperate function', () => {
      it('should return undefined if findOneByType fails', async () => {
        jest
          .spyOn(operationService, 'findOneByType')
          .mockRejectedValueOnce(new Error('Not Found'));

        expect(
          await service['getBalanceAndAmount']('abc', '1'),
        ).toBeUndefined();
      });

      it('should return undefined if getBalanceById fails', async () => {
        jest
          .spyOn(operationService, 'findOneByType')
          .mockResolvedValueOnce({ cost: 1 } as Operation);

        jest
          .spyOn(recordService, 'getBalanceByUserId')
          .mockRejectedValueOnce(new Error('Not Found'));

        expect(
          await service['getBalanceAndAmount']('abc', '1'),
        ).toBeUndefined();
      });

      it('should return undefined if the user dont have funds', async () => {
        jest
          .spyOn(operationService, 'findOneByType')
          .mockResolvedValueOnce({ cost: 2 } as Operation);

        jest
          .spyOn(recordService, 'getBalanceByUserId')
          .mockResolvedValueOnce(1);

        expect(
          await service['getBalanceAndAmount']('abc', '1'),
        ).toBeUndefined();
      });

      it('should return the new Balance if the user has funds', async () => {
        jest
          .spyOn(operationService, 'findOneByType')
          .mockResolvedValueOnce({ cost: 2 } as Operation);

        jest
          .spyOn(recordService, 'getBalanceByUserId')
          .mockResolvedValueOnce(10);

        expect(await service['getBalanceAndAmount']('abc', '1')).toStrictEqual({
          balance: 8,
          amount: 2,
        });
      });
    });
    it('should throw an error if user has insufficient balance', () => {
      jest
        .spyOn(service, <any>'getBalanceAndAmount')
        .mockImplementationOnce(() => false);

      service
        .operate({ type: OperationEnum.ADDITION, userId: 'abc' })
        .catch((e) => expect(e.message).toBe(UserErrors.INSUFFICIENT_BALANCE));
    });

    it('should throw an error if the result save fails', async () => {
      jest
        .spyOn(service, <any>'getBalanceAndAmount')
        .mockImplementationOnce(() => 8);

      jest
        .spyOn(recordService, 'create')
        .mockRejectedValueOnce(new Error('Database Error'));

      try {
        await service.operate({
          type: OperationEnum.ADDITION,
          userId: '123',
          args: [1, 2],
        });
      } catch (e) {
        expect(e.message).toBe('Database Error');
      }
    });

    it('should return the record', async () => {
      jest
        .spyOn(service, <any>'getBalanceAndAmount')
        .mockImplementationOnce(() => ({
          balance: 8,
          amount: 2,
        }));

      const expectedResult = {
        operationResponse: '3',
        operationType: OperationEnum.ADDITION,
        userBalance: 8,
        amount: 2,
        userId: '123',
      };

      const recordServiceSpy = jest
        .spyOn(recordService, 'create')
        .mockResolvedValueOnce({
          save: jest.fn(),
        } as any);

      await service.operate({
        type: OperationEnum.ADDITION,
        userId: '123',
        args: [1, 2],
      });
      expect(recordServiceSpy).toBeCalledWith(expectedResult);
    });
  });
});
