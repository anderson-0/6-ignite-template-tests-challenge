import request from 'supertest';

import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

import { User } from '@modules/users/entities/User';

let connection: Connection;
let userTest: User;

describe('Show User Profile Controller', () => {

  beforeAll(async () => {
    connection = await createConnection('localhost');
    await connection.runMigrations();

    const id = uuidV4();

    userTest = {
      id,
      name: `Test User`,
      email: `email${id}@email.com`,
      password: '123123',
      created_at: new Date(),
      updated_at: new Date(),
      statement: []
    }

    const password = await hash(userTest.password, 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
           VALUES('${userTest.id}', '${userTest.name}', '${userTest.email}',
           '${password}', 'now()', 'now()')`,
    );

  });

  afterAll(async () => {
    await connection.query(
      `DELETE FROM USERS WHERE id = '${userTest.id}'`,
    );
    await connection.close();
  });

  describe("SHOULD", () => {
    it('should be able to show a user profile', async() => {
      const responseToken = await request(app)
        .post('/api/v1/sessions')
        .send({
          email: userTest.email,
          password: userTest.password
        });

      const { token } = responseToken.body;

      const responseShowProfile = await request(app)
        .get('/api/v1/profile')
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(responseShowProfile.body).toHaveProperty("id")
    })
  });
})
