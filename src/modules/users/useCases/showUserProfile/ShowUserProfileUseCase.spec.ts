import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Show User Profile Use Case', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  describe("SHOULD", () => {
    it('Show User Profile Info', async () => {
      const user: ICreateUserDTO = {
        name: 'Name',
        email: 'email@email.com',
        password: '123123'
      }

      const userCreated = await createUserUseCase.execute(user);

      const result = await showUserProfileUseCase.execute(String(userCreated.id));

      expect(result.email).toEqual(user.email);
    });
  });

  describe("SHOULD NOT", () => {
    it('Show profile of non-existent user', async() => {
      await expect(
        showUserProfileUseCase.execute('non-existing-id')
      ).rejects.toBeInstanceOf(AppError);
    });
  })
});
