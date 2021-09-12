import { OperationType } from '@modules/statements/entities/Statement';
import { User } from '@modules/users/entities/User';

import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

import { AppError } from '@shared/errors/AppError';

import {CreateStatementUseCase} from './CreateStatementUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let user: User;


describe('Create Statement Use Case', ()=>{

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, inMemoryStatementsRepository)
    user = await usersRepositoryInMemory.create({
      name: 'Name',
      email: 'email@email.com',
      password: '123123'
    });
  });

  describe("SHOULD", () => {
    it('Create a new deposit', async ()=>{
      const statement = await createStatementUseCase.execute( {
        user_id: String(user.id),
        type: `deposit` as OperationType,
        amount: 1,
        description: '$1 deposit'
      });

      expect(statement).toHaveProperty('id');
    });

    it('Create a new withdraw if there are sufficient funds', async ()=>{

      // Deposit
      await createStatementUseCase.execute( {
        user_id: String(user.id),
        type: `deposit` as OperationType,
        amount: 100,
        description: 'deposit $100'
      })

      //Withdraw
      const statement =  await createStatementUseCase.execute( {
        user_id: String(user.id),
        type: `withdraw` as OperationType,
        amount: 90,
        description: 'withdraw $100'
      });

      expect(statement).toHaveProperty('id');
    })
  });

  describe("SHOULD NOT", () => {
    it('Create a statement for a non-existing user', async ()=>{
      await expect(
        createStatementUseCase.execute({
          user_id: 'noexistentuser',
          type: `deposit` as OperationType,
          amount: 1,
          description: '$1 deposit'
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Create a new withdraw if there are insufficient funds', async ()=>{
      await expect(
        createStatementUseCase.execute({
          user_id: String(user.id),
          type: `withdraw` as OperationType,
          amount: 90,
          description: 'withdraw $1'
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });





})
