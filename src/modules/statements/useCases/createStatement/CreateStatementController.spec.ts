import request from 'supertest';

import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../app';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { User } from '@modules/users/entities/User';

let connection: Connection;
let user: User;

describe('Create Statement Controller', () => {

  beforeAll(async () => {
    connection = await createConnection('localhost');
    await connection.runMigrations();
    const id = uuidV4();

    user = {
      id,
      name: `Statement`,
      email: `email${id}@email.com`,
      password: '123123',
      created_at: new Date(),
      updated_at: new Date(),
      statement: []
    }

    const password = await hash(user.password, 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
           VALUES('${user.id}', '${user.name}', '${user.email}',
           '${password}', 'now()', 'now()')`,
    );

  });

  afterAll(async () => {
    await connection.query(
      `DELETE FROM STATEMENTS WHERE user_id = '${user.id}'`,
    );
    await connection.query(
      `DELETE FROM USERS WHERE id = '${user.id}'`,
    );
    await connection.close();
  });

  describe("SHOULD", () => {
    it('Create a statement', async() => {
        const responseToken = await request(app)
          .post('/api/v1/sessions')
          .send({
            email: user.email,
            password: user.password
          });

        const { token } = responseToken.body;

        const response = await request(app)
          .post('/api/v1/statements/deposit')
          .send({
            amount: 1,
            description: '$1 deposit'
          })
          .set({
            Authorization: `Bearer ${token}`,
          });

        expect(response.status).toBe(201);
      });
  });
});
