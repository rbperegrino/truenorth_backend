import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './../src/app.module';
import { User, UserStatusEnum } from '../src/user/entities/user.entity';
import {
  Operation,
  OperationEnum,
} from '../src/operation/entities/operation.entity';
import { TypeOrmE2eConfigService } from '../src/db/ormconfig.e2e';

describe('UserController (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication;
  let userRepository: Repository<User>;
  let operationRepository: Repository<Operation>;
  let authorization;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({ envFilePath: '.e2e.env', isGlobal: true }),
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmE2eConfigService,
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository<User>,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = app.get(getRepositoryToken(User));
    operationRepository = app.get(getRepositoryToken(Operation));

    const user = {
      username: 'test@test.com',
      password: '$2b$10$2ksyW5IoYXntOU1BbfP34uTEy0HzjfzmXLFN6KcLMNHDKvIpHx2TG',
      status: UserStatusEnum.ACTIVE,
    };

    await userRepository.save(user);

    for (const argument in OperationEnum) {
      await operationRepository.save({
        type: OperationEnum[argument],
        cost: 2,
      });
    }

    await app.init();
  });

  afterAll(async () => {
    await userRepository.query(`DELETE from public.user;`);
    await operationRepository.query(`DELETE from public.operation;`);
    await operationRepository.query(`DELETE from public.record;`);
  });

  describe('Authentication', () => {
    it('[Auth] / (POST)', async () => {
      const userCredentials = {
        username: 'test@test.com',
        password: 'test',
      };
      return request(app.getHttpServer())
        .post('/auth')
        .set('Accept', 'application/json')
        .send(userCredentials)
        .expect((response) => {
          const { user, accessToken } = response.body;
          expect(user.id).toBeDefined();
          expect(accessToken).toBeDefined();
          authorization = `Bearer ${accessToken}`;
        });
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', authorization)
      .expect(HttpStatus.OK);
  });

  it('/ (POST)', () => {
    const user = { username: 'create@test.com', password: 'test' };
    return request(app.getHttpServer())
      .post('/user')
      .set('Authorization', authorization)
      .send(user)
      .expect(HttpStatus.CREATED);
  });

  describe('Operations', () => {
    it('ADDITION', () => {
      const payload = {
        type: 'addition',
        args: [1, 2],
      };

      return request(app.getHttpServer())
        .post('/user/operate')
        .set('Authorization', authorization)
        .send(payload)
        .expect((response) => {
          expect(response.statusCode).toBe(HttpStatus.OK);
          const { amount, userBalance, operationResponse } = response.body;
          expect(amount).toBe(2);
          expect(userBalance).toBe(18);
          expect(operationResponse).toBe('3');
        });
    });

    it('SUBTRACTION', () => {
      const payload = {
        type: 'subtraction',
        args: [10, 5],
      };

      return request(app.getHttpServer())
        .post('/user/operate')
        .set('Authorization', authorization)
        .send(payload)
        .expect((response) => {
          expect(response.statusCode).toBe(HttpStatus.OK);
          const { amount, userBalance, operationResponse } = response.body;
          expect(amount).toBe(2);
          expect(userBalance).toBe(16);
          expect(operationResponse).toBe('5');
        });
    });

    it('MULTIPLICATION', () => {
      const payload = {
        type: 'multiplication',
        args: [10, 5],
      };

      return request(app.getHttpServer())
        .post('/user/operate')
        .set('Authorization', authorization)
        .send(payload)
        .expect((response) => {
          expect(response.statusCode).toBe(HttpStatus.OK);
          const { amount, userBalance, operationResponse } = response.body;
          expect(amount).toBe(2);
          expect(userBalance).toBe(14);
          expect(operationResponse).toBe('50');
        });
    });

    it('DIVISION', () => {
      const payload = {
        type: 'division',
        args: [10, 5],
      };

      return request(app.getHttpServer())
        .post('/user/operate')
        .set('Authorization', authorization)
        .send(payload)
        .expect((response) => {
          expect(response.statusCode).toBe(HttpStatus.OK);
          const { amount, userBalance, operationResponse } = response.body;
          expect(amount).toBe(2);
          expect(userBalance).toBe(12);
          expect(operationResponse).toBe('2');
        });
    });

    it('SQUARE ROOT', () => {
      const payload = {
        type: 'square_root',
        args: [9],
      };

      return request(app.getHttpServer())
        .post('/user/operate')
        .set('Authorization', authorization)
        .send(payload)
        .expect((response) => {
          expect(response.statusCode).toBe(HttpStatus.OK);
          const { amount, userBalance, operationResponse } = response.body;
          expect(amount).toBe(2);
          expect(userBalance).toBe(10);
          expect(operationResponse).toBe('3');
        });
    });

    it('RANDOM STRING', () => {
      const payload = {
        type: 'random_string',
      };

      return request(app.getHttpServer())
        .post('/user/operate')
        .set('Authorization', authorization)
        .send(payload)
        .expect((response) => {
          expect(response.statusCode).toBe(HttpStatus.OK);
          const { amount, userBalance, operationResponse } = response.body;
          expect(amount).toBe(2);
          expect(userBalance).toBe(8);
          expect(operationResponse.length).toBe(8);
        });
    });
  });
});
