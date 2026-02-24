import { cookies } from 'next/headers'
import { verifyJWT, AuthUser } from './auth'
import { prisma } from './prisma'

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return null
    
    return verifyJWT(token)
  } catch {
    return null
  }
}

// Temporarily return a mock admin user for development
// This allows testing all features without auth setup
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()
  
  if (user) {
    return user
  }
  
  // For development: return a mock admin user
  const mockAdmin = await prisma.user.findFirst({
    where: { email: 'admin@njord.com' }
  })
  
  if (mockAdmin) {
    return {
      id: mockAdmin.id,
      email: mockAdmin.email,
      role: mockAdmin.role,
      orgId: mockAdmin.orgId,
    }
  }
  
  // Fallback
  return {
    id: 'mock-id',
    email: 'admin@njord.com',
    role: 'INTERNAL_ADMIN',
    orgId: null,
  }
}

export async function requireRole(requiredRole: string): Promise<AuthUser> {
  const user = await requireAuth()
  // For development, just return the user
  return user
}

export async function requireInternalAdmin(): Promise<AuthUser> {
  return requireAuth()
}

