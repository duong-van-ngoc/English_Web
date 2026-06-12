import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as JwtService;
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(prisma as never, jwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers a user with normalized email and trimmed name', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'student@example.com',
      name: 'Demo Student',
      role: UserRole.USER,
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    const result = await service.register({
      email: '  STUDENT@example.com ',
      name: ' Demo Student ',
      password: 'secret123',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'student@example.com',
      },
      select: {
        id: true,
      },
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'student@example.com',
        name: 'Demo Student',
        password: 'hashed-password',
        role: UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    expect(result.email).toBe('student@example.com');
  });

  it('rejects duplicated email on register', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
    });

    await expect(
      service.register({
        email: 'student@example.com',
        name: 'Student',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns token and public user on login', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'student@example.com',
      name: 'Demo Student',
      role: UserRole.USER,
      password: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('jwt-token');

    const result = await service.login({
      email: ' STUDENT@example.com ',
      password: 'secret123',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'student@example.com',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: {
        id: 'user-1',
        email: 'student@example.com',
        name: 'Demo Student',
        role: UserRole.USER,
      },
    });
  });

  it('rejects invalid password on login', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'student@example.com',
      name: 'Demo Student',
      role: UserRole.USER,
      password: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({
        email: 'student@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
