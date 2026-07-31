import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { HealthResponse } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return the API health status', () => {
      const result: HealthResponse = appController.getHealth();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('enterprise-order-management-api');
      expect(typeof result.timestamp).toBe('string');
      expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
    });
  });
});
