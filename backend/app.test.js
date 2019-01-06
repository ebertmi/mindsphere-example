const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');
const app = require('./app');


describe('Test the /me path w/o Authorization information', () => {
    test('It should response with error', async () => {
        const response = await request(app).get('/me');
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('errorMessage');
    });
})

describe('Test the /me path with Authorization information', () => {
    test('It should response with json result', async () => {
        const token = jwt.sign({
          ten: 'testtenant',
          user_name: 'test_user',
          email: 'test_user@test.test',
          subtenant: '',
          user_id: 'testuserid',
          scopes: [`${config.mdsp.appName}.${config.mdsp.scope}`]
        }, 'shhhhh');

        const response = await request(app).get('/me').set('Authorization', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          userName: 'test_user',
          userTenant: 'testtenant'
        });
    });
})