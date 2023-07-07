/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Repository, DataSource } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

export const mockedUser = {
  name: 'Alni',
  password: '1234',
  id: '123',
  active: 'active',
};

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneOrFail: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    create: jest.fn((entity) => {
      save: jest.fn();
    }),
  }),
);
