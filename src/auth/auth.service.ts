import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';

interface StoredUser extends AuthenticatedUser {
  passwordHash: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  private readonly demoUser: StoredUser = {
    id: '1',
    name: 'Portfolio Administrator',
    email: 'admin@orderflow.dev',
    role: 'admin',
    passwordHash: hashSync('Admin123!', 10),
  };

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const emailMatches =
      loginDto.email.toLowerCase() === this.demoUser.email.toLowerCase();

    const passwordMatches = compareSync(
      loginDto.password,
      this.demoUser.passwordHash,
    );

    if (!emailMatches || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = this.toAuthenticatedUser(this.demoUser);

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      accessToken,
      user,
    };
  }

  private toAuthenticatedUser(user: StoredUser): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
