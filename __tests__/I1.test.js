

const request = require('supertest');
const app = require('../server'); 
const express = require('express');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { Sequelize } = require('sequelize');
const path = require('path');

//
 const { sequelize } = require('../config/config'); 
describe('Integration Tests', () => {

  console.log('DB_DATABASE', process.env.DB_DATABASE)

  beforeAll(async () => {
    await sequelize.sync() 
})

afterAll(async () => {
  await sequelize.sync() 
})

  it('Test 1: Create an account and validate account existence with GET call', async () => {

    const createUserResponse = await request(app).post('/v6/user').send({
        "first_name": "Jane",
        "last_name": "Doe",
        "password": "password",
        "username": "jane.doe@example.com"
    });

    expect(createUserResponse.status).toBe(201);

    const getUserResponse = await request(app)
    .get(`/v6/user/self`)
    .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:password').toString('base64')}`);
  
  expect(getUserResponse.status).toBe(200);
 
  });
  it('Test 2: Update the account and using the GET call, validate the account was updated.', async () => {

    const updatedUserData = {
      first_name: 'firstnameupdated',
      last_name: 'lastnameupdated',
      password: 'updated_password',
    };
    const updateUserResponse = await request(app)
  .put(`/v6/user/self`)
  .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:password').toString('base64')}`)
  .send(updatedUserData);
  expect(updateUserResponse.status).toBe(204);
  const getUserResponseAfterUpdate = await request(app)
  .get(`/v6/user/self`)
  .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:updated_password').toString('base64')}`);
  expect(getUserResponseAfterUpdate.status).toBe(200);
  expect(getUserResponseAfterUpdate.body.first_name).toBe(updatedUserData.first_name);
  expect(getUserResponseAfterUpdate.body.last_name).toBe(updatedUserData.last_name);

  });
});
module.exports = { sequelize };
