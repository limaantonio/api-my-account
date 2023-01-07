import request from 'supertest';
import { describe } from '@jest/globals';
import { routes } from '../../routes';

describe('Test the endpoints of the BudgetController', () => {
  test('should return a 200 status code', async () => {
    request(await routes)
      .post('/budget')
      .send({
        year: 2021,
      });
    expect(200).toBe(200);
  });
  test('should return a 400 status code', async () => {
    request(await routes)
      .post('/budget')
      .send({
        year: 2021,
      });
    expect(400).toBe(400);
  });
});
