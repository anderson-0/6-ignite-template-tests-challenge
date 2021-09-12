import { OperationType } from '@modules/statements/entities/Statement';
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { User } from '@modules/users/entities/User';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import {GetStatementOperationUseCase} from './GetStatementOperationUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let user: User;

describe('Get Statement Operation Use Case', () => {

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory, inMemoryStatementsRepository)
    user = await usersRepositoryInMemory.create({
      name: 'Name',
      email: 'email@email.com',
      password: '123123'
    });
  });

  describe("SHOULD", () => {
    it('Get a statement operation', async () => {
      const statement = await inMemoryStatementsRepository.create( {
        user_id: String(user.id),
        type: `deposit` as OperationType,
        amount: 1,
        description: 'deposit $1'
      });

      const operation = await getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: String(statement.id)
      });

      expect(operation.type).toBe('deposit');
    });
  });

  describe("SHOULD NOT", () => {
    it('Get a statement operation for a non-existing user', async () => {
      await expect(async () => {
        const statement = await inMemoryStatementsRepository.create( {
          user_id: String(user.id),
          type: `deposit` as OperationType,
          amount: 1,
          description: 'deposit $1'
        });

        await getStatementOperationUseCase.execute({
          user_id: 'non-existing-user-id',
          statement_id: String(statement.id)
        })
      }).rejects.toBeInstanceOf(AppError);
    });

    it('Get a statement operation for a non-existing statement', async () => {
      await expect(
        getStatementOperationUseCase.execute({
          user_id: String(user.id),
          statement_id: 'non-existing-statement-id'
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
