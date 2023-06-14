'use strict';

const { app } = require('../src/server.js');
const { db, users, checkin, userAuth } = require('../src/models');
const supertest = require('supertest');
const request = supertest(app);

let testUser;
let authToken;

beforeAll(async () => {
  await db.sync({ force: true });

  // Create a test user
  testUser = await userAuth.create({
    username: 'testAdmin',
    password: 'pass123',
    role: 'admin',
  });

  // Login the test user and get the auth token
  const loginResponse = await request.post('/api/signin').send({
    username: 'testAdmin',
    password: 'pass123',
  });
  authToken = loginResponse.body.token;
});

afterAll(async () => {
  await db.close();
});

describe('Routes', () => {
  it('creates a check-in record', async () => {
    const response = await request.post('/api/checkin').send({
      userId: testUser.id,
      timeIn: '2023-06-13T09:00:00Z',
      timeOut: '2023-06-13T10:00:00Z',
      moodIn: 2,
      moodOut: 4,
    }).set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toEqual(201);
    expect(response.body.userId).toEqual(testUser.id);
  });

  it('cannot get all check-in records with a bad token', async () => {
    const response = await request.get('/api/checkin').set('Authorization', `Bearer ${authToken}.some.extra.junk`);
    const error = response.body;

    expect(response.status).toEqual(401);
    expect(error.message).toEqual('Invalid token');
  });

  it('gets all check-in records', async () => {
    const response = await request.get('/api/checkin').set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('gets a single check-in record', async () => {
    const allCheckins = await checkin.findAll();
    const checkinId = allCheckins[0].id;

    const response = await request.get(`/api/checkin/${checkinId}`).set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(checkinId);
  });

  it('updates a check-in record', async () => {
    const allCheckins = await checkin.findAll();
    const checkinId = allCheckins[0].id;

    const response = await request.put(`/api/checkin/${checkinId}`).send({
      timeIn: '2023-06-13T09:00:00Z',
      timeOut: '2023-06-13T11:00:00Z',
    }).set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(checkinId);
    expect(response.body.timeOut).toEqual('2023-06-13T11:00:00Z');
  });

  it('deletes a check-in record', async () => {
    const allCheckins = await checkin.findAll();
    const checkinId = allCheckins[0].id;

    const response = await request.delete(`/api/checkin/${checkinId}`).set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(1);
  });
});
