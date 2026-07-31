import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'enterprise-order-management-api',
      timestamp: new Date().toISOString(),
    };
  }
}
