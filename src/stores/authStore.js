import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authService from '@/services/authService'

const TOKEN_KEY = 'redlane_auth_token'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const login = async (email, password) => {
    isLoading.value = true
    try {
      const response = await authService.login(email, password)
      token.value = response.token
      user.value = response.user
      localStorage.setItem(TOKEN_KEY, response.token)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async userData => {
    isLoading.value = true
    try {
      const response = await authService.register(userData)
      token.value = response.token
      user.value = response.user
      localStorage.setItem(TOKEN_KEY, response.token)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error)
    } finally {
      // Always clear local state
      user.value = null
      token.value = null
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  const getAuthenticatedUser = async () => {
    isLoading.value = true
    try {
      const userData = await authService.me()
      user.value = userData
    } catch (error) {
      // If fetching user fails, clear auth state
      user.value = null
      token.value = null
      localStorage.removeItem(TOKEN_KEY)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      token.value = response.token
      user.value = response.user
      localStorage.setItem(TOKEN_KEY, response.token)
    } catch (error) {
      // If refresh fails, clear auth state
      user.value = null
      token.value = null
      localStorage.removeItem(TOKEN_KEY)
      throw error
    }
  }

  const forgotPassword = async email => {
    isLoading.value = true
    try {
      return await authService.forgotPassword(email)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async data => {
    isLoading.value = true
    try {
      return await authService.resetPassword(data)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    login,
    register,
    logout,
    getAuthenticatedUser,
    refreshToken,
    forgotPassword,
    resetPassword,
  }
})
