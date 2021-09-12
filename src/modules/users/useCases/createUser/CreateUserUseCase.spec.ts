import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserError } from './CreateUserError';

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  describe("SHOULD", () => {
    it('Create a new user', async () => {
      const user = await createUserUseCase.execute({
        name: 'Name user',
        email: 'mail@mail.com',
        password: '1234'
      });

      expect(user).toHaveProperty('id');
    });
  });
  describe("SHOULD NOT", () => {
    it('Create a user with existing email', async () => {
      const user = await createUserUseCase.execute({
        name: 'Name',
        email: 'email@email.com',
        password: '123123'
      });

      await expect(
        createUserUseCase.execute({
          name: 'Another name',
          email: user.email,
          password: user.password
        })
      ).rejects.toBeInstanceOf(CreateUserError);
    });
  });




});
