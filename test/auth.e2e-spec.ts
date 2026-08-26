import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');

    await app.init();

    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 429 after exceeding login rate limit', async () => {
    const credentials = {
      email: 'admin@orderflow.dev',
      password: 'wrong-password',
    };

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await request(server)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);
    }

    await request(server).post('/api/auth/login').send(credentials).expect(429);
  });
});
