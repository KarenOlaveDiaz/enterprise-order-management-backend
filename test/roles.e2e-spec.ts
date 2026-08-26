import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';

import { AppModule } from '../src/app.module';

interface LoginResponse {
  accessToken: string;
}

describe('Roles authorization (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let adminToken: string;
  let demoToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    await app.init();

    server = app.getHttpServer() as Server;

    adminToken = await login('admin@orderflow.dev', 'Admin123!');

    demoToken = await login('demo@orderflow.dev', 'Demo123!');
  });

  afterAll(async () => {
    await app.close();
  });

  async function login(email: string, password: string): Promise<string> {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        email,
        password,
      })
      .expect(200);

    const body = response.body as LoginResponse;

    return body.accessToken;
  }

  it('allows DEMO to read orders', async () => {
    await request(server)
      .get('/api/orders')
      .set('Authorization', `Bearer ${demoToken}`)
      .expect(200);
  });

  it('blocks DEMO from creating orders', async () => {
    await request(server)
      .post('/api/orders')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({
        customerName: 'Demo Customer',
        customerEmail: 'demo.customer@example.com',
        product: 'Demo Product',
        quantity: 1,
      })
      .expect(403);
  });

  it('blocks DEMO from deleting orders', async () => {
    await request(server)
      .delete('/api/orders/non-existing-id')
      .set('Authorization', `Bearer ${demoToken}`)
      .expect(403);
  });

  it('blocks DEMO from updating order status', async () => {
    await request(server)
      .patch('/api/orders/non-existing-id/status')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({
        status: 'completed',
      })
      .expect(403);
  });

  it('allows ADMIN to create orders', async () => {
    await request(server)
      .post('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerName: 'Admin Test',
        customerEmail: 'admin.test@example.com',
        product: 'Test Product',
        quantity: 1,
      })
      .expect(201);
  });
});
