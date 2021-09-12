import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';


import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;
let id: string;
describe('Create User Controller', () => {

  beforeAll(async () => {
    connection = await createConnection('localhost');
    await connection.runMigrations();

    id = uuidV4();

  });

  afterAll(async () => {
    await connection.query(
      `DELETE FROM USERS WHERE email = 'email${id}@mail.com'`,
    );
    await connection.close();
  });

  describe("SHOULD", () => {
    it('Create a new user', async() => {
        const response = await request(app)
          .post('/api/v1/users')
          .send({
            name: "Test User",
            email: `email${id}@email.com`,
            password: "123123"
          });
        expect(response.status).toBe(201);
      });
  });

})
