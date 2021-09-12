import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

import { User } from '@modules/users/entities/User';

import { AppError } from '@shared/errors/AppError';

import {GetBalanceUseCase} from './GetBalanceUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let user: User;

describe('Get Balance Use Case', () => {

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, usersRepositoryInMemory)
    user = await usersRepositoryInMemory.create({
      name: 'Name',
      email: 'email@email.com',
      password: '123123'
    });
  });

  describe("SHOULD", () => {
    it('List balance', async () => {
      const statement = await getBalanceUseCase.execute({
        user_id: String(user.id)
      })

      expect(statement).toHaveProperty('balance');
      expect(statement).toHaveProperty('statement');
    });
  });

  describe("SHOULD NOT", () => {
    it('List balance for a nonexistent user', async () => {
      await expect(
        getBalanceUseCase.execute(
          {user_id: 'non-existing-id'
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
