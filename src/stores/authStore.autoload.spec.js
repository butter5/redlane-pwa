import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import * as authService from '@/services/authService'

vi.mock('@/services/authService')

describe('Auth Store - Auto-load User on Init', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should auto-load user if token exists in localStorage on store init', async () => {
    // Set token in localStorage before creating store
    localStorage.setItem('redlane_auth_token', 'valid-token-from-storage')
    
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    }
    
    authService.me.mockResolvedValue(mockUser)

    // Create store - token should be loaded from localStorage
    const store = useAuthStore()
    expect(store.token).toBe('valid-token-from-storage')
    
    // Now call getAuthenticatedUser which would be called on app init
    await store.getAuthenticatedUser()
    
    expect(store.user).toEqual(mockUser)
    expect(authService.me).toHaveBeenCalledTimes(1)
  })

  it('should not attempt to load user if no token in localStorage', () => {
    const store = useAuthStore()
    
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should clear token if auto-load user fails', async () => {
    localStorage.setItem('redlane_auth_token', 'invalid-token')
    
    authService.me.mockRejectedValue(new Error('Unauthorized'))

    const store = useAuthStore()
    expect(store.token).toBe('invalid-token')
    
    await expect(store.getAuthenticatedUser()).rejects.toThrow('Unauthorized')
    
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(localStorage.getItem('redlane_auth_token')).toBeNull()
  })
})
