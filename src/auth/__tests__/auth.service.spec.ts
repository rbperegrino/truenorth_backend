import { Repository } from 'typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { MockType, repositoryMockFactory } from '../../../test/utils';
import { mockedUser } from '../../user/__tests__/mocks/mock';
import { Record } from '../../record/entities/record.entity';
import { Operation } from '../../operation/entities/operation.entity';
import { OperationService } from '../../operation/operation.service';
import { RecordService } from '../../record/record.service';
import { HttpService } from '@nestjs/axios';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let repositoryUserMock: MockType<Repository<User>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: process.env.SECRETKEY || 'secretKey',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        // Provide your mock instead of the actual repository

        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: OperationService,
          useValue: {},
        },
        {
          provide: RecordService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    repositoryUserMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a jwt payload', async () => {
    repositoryUserMock.findOneOrFail.mockReturnValue(mockedUser);
    const responseUser = await service.createJwtPayload(mockedUser);
    expect(responseUser.user.id).toEqual(mockedUser.id);
  });

  it('should throw error if user dont exist', async () => {
    const error = new UnauthorizedException();
    jest
      .spyOn(userService, 'findOneByUsername')
      .mockResolvedValueOnce(<User>(<unknown>mockedUser));
    try {
      await service.validateUserByJwt({ email: 'test@error.com' });
    } catch (e) {
      expect(e.message).toEqual(error.message);
    }
    // expect(repositoryUserMock.findOneOrFail).toHaveBeenCalledWith({
    //   where: { email: 'test@error.com' },
    // });
  });

  it('should return a token if user exists', async () => {
    repositoryUserMock.findOneOrFail.mockReturnValue(mockedUser);

    const response = await service.validateUserByJwt({
      email: mockedUser.username,
    });

    expect(response.accessToken).not.toBeNull();
    expect(response.accessToken.length).toBeGreaterThan(0);
  });

  it('should reject if password is wrong', async () => {
    const error = new UnauthorizedException();

    const loginUser = {
      active: true,
      checkPassword: jest.fn(() => false),
    };

    repositoryUserMock.findOneOrFail.mockReturnValue(loginUser);

    try {
      await service.validateUserByPassword(<User>(<unknown>mockedUser));
    } catch (e) {
      expect(e.message).toEqual(error.message);
    }
  });

  it('should return a token if validate user by password', async () => {
    const loginUser = {
      active: true,
      checkPassword: jest.fn(() => true),
    };

    repositoryUserMock.findOneOrFail.mockReturnValue(loginUser);

    const response = await service.validateUserByPassword(
      mockedUser as unknown as User,
    );

    expect(response.accessToken).not.toBeNull();
    expect(response.accessToken.length).toBeGreaterThan(0);

    // expect(repositoryUserMock.findOneOrFail).toHaveBeenCalledWith({
    //   where: { username: mockedUser.username },
    // });
  });
});
