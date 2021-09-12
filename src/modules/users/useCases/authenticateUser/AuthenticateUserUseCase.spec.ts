import { v4 as uuidV4 } from 'uuid';

import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import {InMemoryUsersRepository  } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let id: string;
describe('Autenticate User Use Case', ()=> {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  describe("SHOULD", () => {
    it('should be able to authenticate an user', async()=> {
      const user: ICreateUserDTO = {
        name: 'Name',
        email: 'email@email.com',
        password: '123123'
      }

      await createUserUseCase.execute(user);

      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });

      expect(result).toHaveProperty('token');
    });
  })


  describe("SHOULD NOT", () => {
    it('Authenticate a non-existing user', async () => {
      await expect(
        authenticateUserUseCase.execute({
          email: 'false@email.com',
          password: '1234',
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Authenticate user with incorrect password', async () => {
      const user: ICreateUserDTO = {
        name: 'name',
        email: 'email@email.com',
        password: '123123'
      }

      await createUserUseCase.execute(user);

      await expect(
        authenticateUserUseCase.execute({
          email: user.email,
          password: '1231234',
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  })

})
