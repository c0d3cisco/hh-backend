const supertest = require('supertest');
const { app } = require('../src/server.js');
const { db } = require('../src/models/index');

let token;

beforeAll(async () => {
  await db.sync();
});


afterAll(async () => {
  await db.drop();
  await db.close();
});



describe('Comprehensive Server Test', () => {

  it('should signup a new user and return a bearer token', async () => {
    const response = await supertest(app)
      .post('/signup')
      .send({ username: 'admin', password: 'admin', role: 'admin' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('should signin an existing user and return a new bearer token', async () => {
    const response = await supertest(app)
      .post('/signin')
      .auth('admin', 'admin');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('should access the protected route with a valid bearer token', async () => {
    const response = await supertest(app)
      .get('/secret')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to the secret area');
  });

  it('should get all users with bearer token authentication and delete permission', async () => {
    const response = await supertest(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('testing checkinquery route', async () => {
    const response = await supertest(app)
      .get('/checkinquery')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('testing UserWithCheckin route', async () => {
    const response = await supertest(app)
      .get('/UserWithCheckin')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('testing UserWithCheckin route with ID', async () => {
    const response = await supertest(app)
      .get('/UserWithCheckin/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('testing UserWithData route', async () => {
    const response = await supertest(app)
      .get('/UserWithData')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('testing checkinAverage route', async () => {
    const response = await supertest(app)
      .get('/checkinAverage')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('testing getAgeQuery route', async () => {
    const response = await supertest(app)
      .get('/getAgeQuery')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  

});
