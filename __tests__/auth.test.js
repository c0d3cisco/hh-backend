'use strict';

const { app } = require('../src/server.js');
const { db } = require('../src/models');
const supertest = require('supertest');
const request = supertest(app);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Auth router', () => {
  let authToken;

  it('creates an admin user', async () => {
    const response = await request.post('/signup').send({
      username: 'AdminUser',
      password: 'adminPass123',
      role: 'admin',
    });
    
    console.log('response for creating admin', response.body);

    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual('AdminUser');
    expect(response.body.user.role).toEqual('admin');
  });

  it('creates a regular user', async () => {
    const response = await request.post('/signup').send({
      username: 'RegularUser',
      password: 'userPass123',
      role: 'user',
    });

    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual('RegularUser');
    expect(response.body.user.role).toEqual('user');
  });

  it('allows existing user to sign in', async () => {
    const response = await request.post('/signin').auth('RegularUser', 'userPass123',
    );

    // used for additional auth route test /secret 
    authToken = response.body.user.token;
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual('RegularUser');

    // cannot predict exact - it is hashed.
    expect(response.body.user.password).toBeTruthy();

    //token appears different each time, cannot predict exact characters.
    expect(response.body.user.token).toBeTruthy();

  });

  it('fails with bad sign-in credentials', async () => {
    let response = await request.post('/signin').auth('RegularUser', 'badPassword',
    );

    expect(response.status).toEqual(403);
    expect(response.text).toEqual('Invalid Login');
  });

  it('allows access to /secret route with a valid admin token', async () => {
    let adminResponse = await request.post('/signin').auth('AdminUser','adminPass123',
    );

    expect(adminResponse.status).toEqual(200);
    expect(adminResponse.body.user.role).toEqual('admin');

    let adminToken = adminResponse.body.user.token;

    let response = await request.get('/secret').set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('Welcome to the secret area');
  });
});
