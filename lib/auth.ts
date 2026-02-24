import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export interface AuthUser {
  id: string
  email: string
  role: string
  orgId: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateJWT(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyJWT(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const user = verifyJWT(token)
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, role: true, orgId: true },
  })

  if (!dbUser) return null

  return {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    orgId: dbUser.orgId,
  }
}

