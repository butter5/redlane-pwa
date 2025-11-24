import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import * as authService from '@/services/authService'

// Mock the auth service
vi.mock('@/services/authService')

describe('authStore', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    // Clear localStorage
    localStorage.clear()
    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have initial state with null user and token', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('should have isAuthenticated getter return false initially', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should have currentUser getter return null initially', () => {
      const store = useAuthStore()
      expect(store.currentUser).toBeNull()
    })
  })

  describe('Login Action', () => {
    it('should set loading state during login', async () => {
      const store = useAuthStore()
      const mockResponse = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      }
      
      authService.login.mockImplementation(() => {
        expect(store.isLoading).toBe(true)
        return Promise.resolve(mockResponse)
      })

      await store.login('test@example.com', 'password')
    })

    it('should login successfully and set user and token', async () => {
      const store = useAuthStore()
      const mockResponse = {
        token: 'test-token-123',
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      }

      authService.login.mockResolvedValue(mockResponse)

      await store.login('test@example.com', 'password')

      expect(store.user).toEqual(mockResponse.user)
      expect(store.token).toBe(mockResponse.token)
      expect(store.isAuthenticated).toBe(true)
      expect(store.isLoading).toBe(false)
    })

    it('should store token in localStorage with correct key', async () => {
      const store = useAuthStore()
      const mockResponse = {
        token: 'test-token-123',
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      }

      authService.login.mockResolvedValue(mockResponse)

      await store.login('test@example.com', 'password')

      expect(localStorage.getItem('redlane_auth_token')).toBe('test-token-123')
    })

    it('should handle login failure', async () => {
      const store = useAuthStore()
      const mockError = new Error('Invalid credentials')

      authService.login.mockRejectedValue(mockError)

      await expect(store.login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials')
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.isLoading).toBe(false)
    })

    it('should call authService.login with correct parameters', async () => {
      const store = useAuthStore()
      const mockResponse = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
      }

      authService.login.mockResolvedValue(mockResponse)

      await store.login('test@example.com', 'password123')

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(authService.login).toHaveBeenCalledTimes(1)
    })
  })

  describe('Register Action', () => {
    it('should register successfully and set user and token', async () => {
      const store = useAuthStore()
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        phone: '1234567890',
      }
      const mockResponse = {
        token: 'new-token-123',
        user: { id: 2, ...userData, password: undefined },
      }

      authService.register.mockResolvedValue(mockResponse)

      await store.register(userData)

      expect(store.user).toEqual(mockResponse.user)
      expect(store.token).toBe(mockResponse.token)
      expect(store.isAuthenticated).toBe(true)
      expect(localStorage.getItem('redlane_auth_token')).toBe('new-token-123')
    })

    it('should set loading state during registration', async () => {
      const store = useAuthStore()
      const userData = { email: 'new@example.com', password: 'password123' }
      
      authService.register.mockImplementation(() => {
        expect(store.isLoading).toBe(true)
        return Promise.resolve({ token: 'token', user: {} })
      })

      await store.register(userData)
      expect(store.isLoading).toBe(false)
    })

    it('should handle registration failure', async () => {
      const store = useAuthStore()
      const userData = { email: 'new@example.com', password: 'password123' }
      const mockError = new Error('Email already exists')

      authService.register.mockRejectedValue(mockError)

      await expect(store.register(userData)).rejects.toThrow('Email already exists')
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Logout Action', () => {
    it('should logout and clear user and token', async () => {
      const store = useAuthStore()
      
      // Setup authenticated state
      store.user = { id: 1, email: 'test@example.com' }
      store.token = 'test-token'
      localStorage.setItem('redlane_auth_token', 'test-token')

      authService.logout.mockResolvedValue()

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('redlane_auth_token')).toBeNull()
    })

    it('should call authService.logout', async () => {
      const store = useAuthStore()
      store.token = 'test-token'
      
      authService.logout.mockResolvedValue()

      await store.logout()

      expect(authService.logout).toHaveBeenCalledTimes(1)
    })

    it('should clear state even if logout API fails', async () => {
      const store = useAuthStore()
      store.user = { id: 1, email: 'test@example.com' }
      store.token = 'test-token'
      localStorage.setItem('redlane_auth_token', 'test-token')

      authService.logout.mockRejectedValue(new Error('Network error'))

      await store.logout()

      // Should still clear local state
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.getItem('redlane_auth_token')).toBeNull()
    })
  })

  describe('GetAuthenticatedUser Action', () => {
    it('should fetch and set current user', async () => {
      const store = useAuthStore()
      store.token = 'valid-token'
      const mockUser = { id: 1, email: 'test@example.com', firstName: 'Test' }

      authService.me.mockResolvedValue(mockUser)

      await store.getAuthenticatedUser()

      expect(store.user).toEqual(mockUser)
      expect(authService.me).toHaveBeenCalledTimes(1)
    })

    it('should set loading state during fetch', async () => {
      const store = useAuthStore()
      store.token = 'valid-token'
      
      authService.me.mockImplementation(() => {
        expect(store.isLoading).toBe(true)
        return Promise.resolve({ id: 1, email: 'test@example.com' })
      })

      await store.getAuthenticatedUser()
      expect(store.isLoading).toBe(false)
    })

    it('should handle fetch user failure and clear token', async () => {
      const store = useAuthStore()
      store.token = 'invalid-token'
      localStorage.setItem('redlane_auth_token', 'invalid-token')

      authService.me.mockRejectedValue(new Error('Unauthorized'))

      await expect(store.getAuthenticatedUser()).rejects.toThrow('Unauthorized')
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.getItem('redlane_auth_token')).toBeNull()
    })
  })

  describe('RefreshToken Action', () => {
    it('should refresh token and update state', async () => {
      const store = useAuthStore()
      store.token = 'old-token'
      const mockResponse = {
        token: 'new-token-456',
        user: { id: 1, email: 'test@example.com' },
      }

      authService.refreshToken.mockResolvedValue(mockResponse)

      await store.refreshToken()

      expect(store.token).toBe('new-token-456')
      expect(store.user).toEqual(mockResponse.user)
      expect(localStorage.getItem('redlane_auth_token')).toBe('new-token-456')
    })

    it('should handle refresh failure and logout', async () => {
      const store = useAuthStore()
      store.token = 'expired-token'
      store.user = { id: 1, email: 'test@example.com' }

      authService.refreshToken.mockRejectedValue(new Error('Token expired'))

      await expect(store.refreshToken()).rejects.toThrow('Token expired')
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.getItem('redlane_auth_token')).toBeNull()
    })
  })

  describe('ForgotPassword Action', () => {
    it('should call authService.forgotPassword with email', async () => {
      const store = useAuthStore()
      
      authService.forgotPassword.mockResolvedValue({ message: 'Email sent' })

      await store.forgotPassword('test@example.com')

      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com')
      expect(authService.forgotPassword).toHaveBeenCalledTimes(1)
    })

    it('should set loading state during request', async () => {
      const store = useAuthStore()
      
      authService.forgotPassword.mockImplementation(() => {
        expect(store.isLoading).toBe(true)
        return Promise.resolve({ message: 'Email sent' })
      })

      await store.forgotPassword('test@example.com')
      expect(store.isLoading).toBe(false)
    })

    it('should handle forgot password failure', async () => {
      const store = useAuthStore()
      
      authService.forgotPassword.mockRejectedValue(new Error('Email not found'))

      await expect(store.forgotPassword('notfound@example.com')).rejects.toThrow('Email not found')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('ResetPassword Action', () => {
    it('should call authService.resetPassword with correct data', async () => {
      const store = useAuthStore()
      const resetData = { token: 'reset-token-123', password: 'newpassword123' }
      
      authService.resetPassword.mockResolvedValue({ message: 'Password reset successful' })

      await store.resetPassword(resetData)

      expect(authService.resetPassword).toHaveBeenCalledWith(resetData)
      expect(authService.resetPassword).toHaveBeenCalledTimes(1)
    })

    it('should set loading state during reset', async () => {
      const store = useAuthStore()
      const resetData = { token: 'reset-token', password: 'newpass' }
      
      authService.resetPassword.mockImplementation(() => {
        expect(store.isLoading).toBe(true)
        return Promise.resolve({ message: 'Success' })
      })

      await store.resetPassword(resetData)
      expect(store.isLoading).toBe(false)
    })

    it('should handle reset password failure', async () => {
      const store = useAuthStore()
      const resetData = { token: 'invalid-token', password: 'newpass' }
      
      authService.resetPassword.mockRejectedValue(new Error('Invalid or expired token'))

      await expect(store.resetPassword(resetData)).rejects.toThrow('Invalid or expired token')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Token Persistence', () => {
    it('should load token from localStorage on init', () => {
      localStorage.setItem('redlane_auth_token', 'persisted-token')
      
      const store = useAuthStore()
      
      expect(store.token).toBe('persisted-token')
    })

    it('should not have token if localStorage is empty', () => {
      const store = useAuthStore()
      
      expect(store.token).toBeNull()
    })

    it('should persist token updates to localStorage', async () => {
      const store = useAuthStore()
      const mockResponse = {
        token: 'new-persisted-token',
        user: { id: 1, email: 'test@example.com' },
      }

      authService.login.mockResolvedValue(mockResponse)

      await store.login('test@example.com', 'password')

      expect(localStorage.getItem('redlane_auth_token')).toBe('new-persisted-token')
    })
  })

  describe('Getters', () => {
    it('isAuthenticated should return true when token exists', () => {
      const store = useAuthStore()
      store.token = 'some-token'
      
      expect(store.isAuthenticated).toBe(true)
    })

    it('isAuthenticated should return false when token is null', () => {
      const store = useAuthStore()
      store.token = null
      
      expect(store.isAuthenticated).toBe(false)
    })

    it('currentUser should return user when set', () => {
      const store = useAuthStore()
      const mockUser = { id: 1, email: 'test@example.com' }
      store.user = mockUser
      
      expect(store.currentUser).toEqual(mockUser)
    })

    it('currentUser should return null when user is not set', () => {
      const store = useAuthStore()
      
      expect(store.currentUser).toBeNull()
    })
  })
})
