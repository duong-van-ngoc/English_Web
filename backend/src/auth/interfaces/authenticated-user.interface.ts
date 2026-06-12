import type { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatarUrl: string | null;
  toeicGoal: number | null;
  level: string | null;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
