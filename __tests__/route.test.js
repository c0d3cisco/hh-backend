'use strict';

const { app } = require('../src/server.js');
const { db, users, checkin, userAuth } = require('../src/models');
const supertest = require('supertest');
const request = supertest(app);

let testAdmin;
let testCheckin;


beforeAll(async () => {
  await db.sync();

  // Create a test user
  testAdmin = await userAuth.create({
    username: 'testAdmin',
    password: 'pass123',
    role: 'admin',
  });

  // const loginResponse = await request.post('/signin').send({
  //   username: 'testAdmin',
  //   password: 'pass123',
  // });

  testCheckin = await request.post('/api/checkin').send({
    userId: testAdmin.id,
    timeIn: '2023-06-13T09:00:00Z',
    timeOut: '2023-06-13T10:00:00Z',
    moodIn: 2,
    moodOut: 4,
  }).set('Authorization', `Bearer ${testAdmin.token}`);

});

// Login the test user and get the auth token
//   console.log('loginResponse', loginResponse);
//   authToken = loginResponse.body.token;
//   console.log('---------------AuthToken-------------------', authToken);
// });

afterAll(async () => {
  await db.drop();
});


// describe('Placeholder for tests', () => {
//   it.todo('Add tests');
// });

describe('Routes', () => {

  test('proof of life', async () => {
    const response = await request.get('/');
    expect(response.status).toEqual(200);
  });

  test('404 on bad route', async () => {
    const response = await request.get('/foo');
    expect(response.status).toEqual(404);
  });

  test('404 on bad method', async () => {
    const response = await request.post('/');
    expect(response.status).toEqual(404);
  });

  it('creates a check-in record', async () => {
    const response = await request.post('/api/checkin').send({
      userId: testAdmin.id,
      timeIn: '2023-06-13T09:00:00Z',
      timeOut: '2023-06-13T10:00:00Z',
      moodIn: 2,
      moodOut: 4,
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(201);
    expect(response.body.userId).toEqual(testAdmin.id);
  });

  it('cannot get all check-in records with a bad token', async () => {
    const response = await request.get('/api/checkinData').set('Authorization', `this shouldnt work`);
    const error = response.error;

    expect(response.status).toEqual(500);
    expect(error.message).toEqual('cannot GET /api/checkinData (500)');
  });

  it('gets all check-in records', async () => {
    const response = await request.get('/api/checkinData').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('gets a single check-in record', async () => {
    const allCheckins = await checkin.findAll();
    const checkinId = allCheckins[0].id;

    const response = await request.get(`/api/checkinData/${checkinId}`).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    // expect(response.body.id).toEqual(checkinId);
  });

  it('updates a check-in record', async () => {
    const allCheckins = await checkin.findAll();
    const checkinId = allCheckins[0].id;

    const response = await request.put(`/api/checkinData/${checkinId}`).send({
      timeIn: '2023-06-13T09:00:00Z',
      timeOut: '2023-06-13T11:00:00Z',
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(checkinId);
    expect(response.body.timeOut).toEqual('2023-06-13T11:00:00.000Z');
  });

  it('deletes a check-in record', async () => {
    const allCheckins = await checkin.findAll();
    const checkinId = allCheckins[0].id;

    const response = await request.delete(`/api/checkinData/${checkinId}`).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(2);
  });
});
