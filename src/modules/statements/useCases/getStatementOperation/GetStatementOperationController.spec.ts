import request from 'supertest';
import { Connection } from 'typeorm';
import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../app';
import createConnection from '../../../../database';

import { User } from '@modules/users/entities/User';

let connection: Connection;
let user: User;

describe('Get Statement Operation Controller', () => {

  beforeAll(async () => {
    connection = await createConnection('localhost');
    await connection.runMigrations();
    const id = uuidV4();

    user = {
      id,
      name: `Name`,
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
    it('Get a statement operarion for an existing user', async() => {
      const responseToken = await request(app)
        .post('/api/v1/sessions')
        .send({
          email: user.email,
          password: user.password
        });

      const { token } = responseToken.body;

      const statementResponse = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 1,
        description: 'deposit $1'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      const idStatement = statementResponse.body.id;

      const response = await request(app)
      .get(`/api/v1/statements/${idStatement}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(idStatement);
    });
  });
});
