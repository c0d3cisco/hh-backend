'use strict';

const { app } = require('../src/server');
const { db, userAuth } = require('../src/models');
const supertest = require('supertest');
const request = supertest(app);

let testUser;
let testAdmin;

beforeAll(async () => {
  await db.sync();
  testUser = await userAuth.create({
    username: 'user',
    password: 'pass123',
    role: 'user',
  });
  testAdmin = await userAuth.create({
    username: 'Admin',
    password: 'pass123',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('ACL Integration', () => {

  it('does not allow User role to access /users', async () => {
    let response = await request.get('/users').set('Authorization', `Bearer ${testUser.token}`);
    let error = JSON.parse(response.text);

    expect(response.status).toEqual(500);
    expect(error.message).toEqual('Access Denied');
  });

  it('does allow an admin /users access', async () => {
    let response = await request.get('/users').set('Authorization', `Bearer ${testAdmin.token}`);

    let result = JSON.parse(response.text);

    expect(response.status).toEqual(200);
    expect(result).toEqual(['user', 'Admin']);

  });

});
