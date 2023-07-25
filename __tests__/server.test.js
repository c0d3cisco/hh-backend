const supertest = require('supertest');
const { app } = require('../src/server.js');
const { db } = require('../src/models/index');
const request = require('request');

let options = {
  method: 'POST',
  url: 'https://dev-3c6lxg8hjpdu1ria.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"IHAQfPbTBLKqyCKcXlMC2la3MDlVRt9Y","client_secret":"uUrj8KtKMZZYtgbCt-T3VpUUvndB8X_gBqSd5oR0nROGgpxss7T-SaWRJBeXBakU","audience":"https://helen-house-backend-v3uq.onrender.com","grant_type":"client_credentials"}',
};

let auth0token;

beforeAll(async () => {
  await db.sync();
  await request(options, function (error, response, body) {
    if (error) throw new Error(error);
    auth0token = JSON.parse(body).access_token;
  });
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
  });

  it('should signin an existing user and return a new bearer token', async () => {
    const response = await supertest(app)
      .post('/signin')
      .auth('admin', 'admin');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('verify /secret wont work without bearer token', async () => {
    const response = await supertest(app)
      .get('/secret')
      .set('Authorization', `Bearer ${auth0token}`);

    expect(response.status).toBe(500);
  });

  it('verify /users wont work without bearer token', async () => {
    const response = await supertest(app)
      .get('/users')
      .set('Authorization', `Bearer ${auth0token}`);
    expect(response.status).toBe(500);
  });

  it('testing checkinquery route', async () => {
    const response = await supertest(app)
      .get('/checkinquery')
      .set('Authorization', `Bearer ${auth0token}`);
    expect(response.status).toBe(200);
  });

  it('testing UserWithCheckin route', async () => {
    const response = await supertest(app)
      .get('/UserWithCheckin')
      .set('Authorization', `Bearer ${auth0token}`);
    expect(response.status).toBe(200);
  });

  it('testing UserWithCheckin route with ID', async () => {
    const response = await supertest(app)
      .get('/UserWithCheckin/1')
      .set('Authorization', `Bearer ${auth0token}`);
    expect(response.status).toBe(200);
  });

  it('testing UserWithData route', async () => {
    const response = await supertest(app)
      .get('/UserWithData')
      .set('Authorization', `Bearer ${auth0token}`);
    expect(response.status).toBe(200);
  });

  it('testing checkinAverage route', async () => {
    const response = await supertest(app)
      .get('/checkinAverage')
      .set('Authorization', `Bearer ${auth0token}`);
    expect(response.status).toBe(200);
  });

  it('testing getAgeQuery route', async () => {
    const response = await supertest(app)
      .get('/getAgeQuery')
      .set('Authorization', `Bearer ${auth0token}`);
    expect(response.status).toBe(200);
  });



});
