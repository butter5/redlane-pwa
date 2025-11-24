import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuth } from '@/composables/useAuth'
import * as authService from '@/services/authService'

vi.mock('@/services/authService')

describe('useAuth composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should expose auth state', () => {
    const auth = useAuth()

    expect(auth).toHaveProperty('user')
    expect(auth).toHaveProperty('token')
    expect(auth).toHaveProperty('isLoading')
    expect(auth).toHaveProperty('isAuthenticated')
    expect(auth).toHaveProperty('currentUser')
  })

  it('should expose auth actions', () => {
    const auth = useAuth()

    expect(auth).toHaveProperty('login')
    expect(auth).toHaveProperty('register')
    expect(auth).toHaveProperty('logout')
    expect(auth).toHaveProperty('getAuthenticatedUser')
    expect(auth).toHaveProperty('refreshToken')
    expect(auth).toHaveProperty('forgotPassword')
    expect(auth).toHaveProperty('resetPassword')
  })

  it('should have reactive isAuthenticated state', async () => {
    const auth = useAuth()
    
    expect(auth.isAuthenticated.value).toBe(false)

    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com' },
    }
    authService.login.mockResolvedValue(mockResponse)

    await auth.login('test@example.com', 'password')

    expect(auth.isAuthenticated.value).toBe(true)
  })

  it('should call authStore methods', async () => {
    const auth = useAuth()
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' },
    }

    authService.login.mockResolvedValue(mockResponse)

    await auth.login('test@example.com', 'password')

    expect(auth.user.value).toEqual(mockResponse.user)
    expect(auth.token.value).toBe(mockResponse.token)
  })

  it('should handle logout correctly', async () => {
    const auth = useAuth()
    
    // Setup authenticated state
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com' },
    }
    authService.login.mockResolvedValue(mockResponse)
    await auth.login('test@example.com', 'password')

    expect(auth.isAuthenticated.value).toBe(true)

    authService.logout.mockResolvedValue()
    await auth.logout()

    expect(auth.isAuthenticated.value).toBe(false)
    expect(auth.user.value).toBeNull()
    expect(auth.token.value).toBeNull()
  })

  it('should provide currentUser getter', async () => {
    const auth = useAuth()
    
    expect(auth.currentUser.value).toBeNull()

    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', firstName: 'Test' },
    }
    authService.login.mockResolvedValue(mockResponse)
    await auth.login('test@example.com', 'password')

    expect(auth.currentUser.value).toEqual(mockResponse.user)
  })

  it('should expose all action methods', () => {
    const auth = useAuth()

    expect(typeof auth.login).toBe('function')
    expect(typeof auth.register).toBe('function')
    expect(typeof auth.logout).toBe('function')
    expect(typeof auth.getAuthenticatedUser).toBe('function')
    expect(typeof auth.refreshToken).toBe('function')
    expect(typeof auth.forgotPassword).toBe('function')
    expect(typeof auth.resetPassword).toBe('function')
  })
})
