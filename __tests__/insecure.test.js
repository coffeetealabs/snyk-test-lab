const express = require('express');
const request = require('supertest');
const attachInsecure = require('../insecure');

function buildApp() {
  const app = express();
  attachInsecure(app);
  return app;
}

describe('/eval route', () => {
  test('evaluates simple arithmetic and returns string', async () => {
    const app = buildApp();
    const res = await request(app).get('/eval').query({ code: '2+2' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('4');
  });

  test('evaluates boolean literal and returns string', async () => {
    const app = buildApp();
    const res = await request(app).get('/eval').query({ code: 'true' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('true');
  });

  test('returns "undefined" when code query param is missing', async () => {
    const app = buildApp();
    const res = await request(app).get('/eval');
    expect(res.status).toBe(200);
    expect(res.text).toBe('undefined');
  });

  test('responds with 5xx on syntax error in provided code', async () => {
    const app = buildApp();
    const res = await request(app).get('/eval').query({ code: '(1+' });
    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(res.status).toBeLessThan(600);
  });

  test('can access global Math and returns max as string', async () => {
    const app = buildApp();
    const res = await request(app).get('/eval').query({ code: 'Math.max(3,10)' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('10');
  });

  test('object result is stringified using default toString', async () => {
    const app = buildApp();
    const res = await request(app).get('/eval').query({ code: '({a:1})' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('[object Object]');
  });

  test('string literal evaluation returns raw string (no extra quotes)', async () => {
    const app = buildApp();
    const res = await request(app).get('/eval').query({ code: '"hello"' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('hello');
  });
});
