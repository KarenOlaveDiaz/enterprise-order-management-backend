import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { UserRole } from '../enums/user-role.enum';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = moduleRef.get<RolesGuard>(RolesGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
  });

  function createExecutionContext(user?: AuthenticatedUser): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows ADMIN when ADMIN role is required', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);

    const context = createExecutionContext({
      id: '1',
      name: 'Portfolio Administrator',
      email: 'admin@orderflow.dev',
      role: UserRole.ADMIN,
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('blocks DEMO when ADMIN role is required', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);

    const context = createExecutionContext({
      id: '2',
      name: 'Portfolio Demo',
      email: 'demo@orderflow.dev',
      role: UserRole.DEMO,
    });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('blocks access when user is missing', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);

    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(false);
  });
});
