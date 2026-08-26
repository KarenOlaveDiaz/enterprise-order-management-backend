import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import type { Server } from 'node:http';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    server = app.getHttpServer() as Server;
  });

  interface HealthResponse {
    status: string;
    service: string;
    timestamp: string;
  }

  it('/api/health (GET)', async () => {
    const response = await request(server).get('/api/health').expect(200);

    const body = response.body as HealthResponse;

    expect(body).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: 'enterprise-order-management-api',
      }),
    );

    expect(body.timestamp).toEqual(expect.any(String));
  });

  afterEach(async () => {
    await app.close();
  });
});
