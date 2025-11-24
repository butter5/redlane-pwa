import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as authService from '@/services/authService'
import apiClient from '@/services/apiClient'

// Mock the apiClient
vi.mock('@/services/apiClient')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call POST /auth/login with email and password', async () => {
      const mockResponse = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      }

      apiClient.post.mockResolvedValue(mockResponse)

      const result = await authService.login('test@example.com', 'password123')

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error on login failure', async () => {
      const mockError = new Error('Invalid credentials')
      apiClient.post.mockRejectedValue(mockError)

      await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      )
    })
  })

  describe('register', () => {
    it('should call POST /auth/register with user data', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        phone: '1234567890',
      }
      const mockResponse = {
        token: 'new-token',
        user: { id: 2, ...userData, password: undefined },
      }

      apiClient.post.mockResolvedValue(mockResponse)

      const result = await authService.register(userData)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(result).toEqual(mockResponse)
    })

    it('should throw error on registration failure', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      }
      const mockError = new Error('Email already exists')
      apiClient.post.mockRejectedValue(mockError)

      await expect(authService.register(userData)).rejects.toThrow('Email already exists')
    })
  })

  describe('logout', () => {
    it('should call POST /auth/logout', async () => {
      apiClient.post.mockResolvedValue({ message: 'Logged out successfully' })

      await authService.logout()

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout')
    })

    it('should handle logout errors gracefully', async () => {
      const mockError = new Error('Network error')
      apiClient.post.mockRejectedValue(mockError)

      await expect(authService.logout()).rejects.toThrow('Network error')
    })
  })

  describe('me', () => {
    it('should call GET /auth/me', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
      }

      apiClient.get.mockResolvedValue(mockUser)

      const result = await authService.me()

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('should throw error when not authenticated', async () => {
      const mockError = new Error('Unauthorized')
      apiClient.get.mockRejectedValue(mockError)

      await expect(authService.me()).rejects.toThrow('Unauthorized')
    })
  })

  describe('forgotPassword', () => {
    it('should call POST /auth/forgot-password with email', async () => {
      const mockResponse = { message: 'Password reset email sent' }

      apiClient.post.mockResolvedValue(mockResponse)

      const result = await authService.forgotPassword('test@example.com')

      expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error if email not found', async () => {
      const mockError = new Error('Email not found')
      apiClient.post.mockRejectedValue(mockError)

      await expect(authService.forgotPassword('notfound@example.com')).rejects.toThrow(
        'Email not found'
      )
    })
  })

  describe('resetPassword', () => {
    it('should call POST /auth/reset-password with token and password', async () => {
      const resetData = {
        token: 'reset-token-123',
        password: 'newpassword123',
      }
      const mockResponse = { message: 'Password reset successful' }

      apiClient.post.mockResolvedValue(mockResponse)

      const result = await authService.resetPassword(resetData)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', resetData)
      expect(result).toEqual(mockResponse)
    })

    it('should throw error on invalid or expired token', async () => {
      const resetData = {
        token: 'invalid-token',
        password: 'newpassword123',
      }
      const mockError = new Error('Invalid or expired token')
      apiClient.post.mockRejectedValue(mockError)

      await expect(authService.resetPassword(resetData)).rejects.toThrow('Invalid or expired token')
    })
  })

  describe('refreshToken', () => {
    it('should call POST /auth/refresh', async () => {
      const mockResponse = {
        token: 'new-token-456',
        user: { id: 1, email: 'test@example.com' },
      }

      apiClient.post.mockResolvedValue(mockResponse)

      const result = await authService.refreshToken()

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh')
      expect(result).toEqual(mockResponse)
    })

    it('should throw error on refresh failure', async () => {
      const mockError = new Error('Token expired')
      apiClient.post.mockRejectedValue(mockError)

      await expect(authService.refreshToken()).rejects.toThrow('Token expired')
    })
  })
})
