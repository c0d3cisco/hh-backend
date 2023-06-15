const supertest = require('supertest');
const { app } = require('../src/server.js');
const { db } = require('../src/models/index');

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

// describe('Placeholder for tests', () => {
//   it.todo('Add tests');
// });

describe('Comprehensive Server Test', () => {
  let token; // Store the bearer token for authenticated requests

  // Test signup and get the bearer token
  it('should signup a new user and return a bearer token', async () => {
    const response = await supertest(app)
      .post('/signup')
      .send({ username: 'admin', password: 'admin', role: 'admin' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  // Test signin and get a new bearer token
  it('should signin an existing user and return a new bearer token', async () => {
    const response = await supertest(app)
      .post('/signin')
      .auth('admin', 'admin');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  // Test the protected route with bearer token authentication
  it('should access the protected route with a valid bearer token', async () => {
    const response = await supertest(app)
      .get('/secret')
      .set('Authorization', `Bearer ${token}`);
    console.log('This is the token for this test: ', token);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to the secret area');
  });

  // Test the route for getting all users with bearer token authentication and delete permission
  it('should get all users with bearer token authentication and delete permission', async () => {
    const response = await supertest(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    console.log('This is the token for this test: ', token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  // Clean up or reset data if necessary
  // afterAll(async () => {
  //   await db.drop();
  //   await db.close();
  // });
});
