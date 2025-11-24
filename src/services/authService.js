import apiClient from '@/services/apiClient'

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object}>} Authentication response
 */
export const login = async (email, password) => {
  return await apiClient.post('/auth/login', { email, password })
}

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<{token: string, user: object}>} Authentication response
 */
export const register = async userData => {
  return await apiClient.post('/auth/register', userData)
}

/**
 * Logout current user
 * @returns {Promise<object>} Logout response
 */
export const logout = async () => {
  return await apiClient.post('/auth/logout')
}

/**
 * Get current authenticated user
 * @returns {Promise<object>} User object
 */
export const me = async () => {
  return await apiClient.get('/auth/me')
}

/**
 * Request password reset email
 * @param {string} email - User email
 * @returns {Promise<object>} Response message
 */
export const forgotPassword = async email => {
  return await apiClient.post('/auth/forgot-password', { email })
}

/**
 * Reset password with token
 * @param {object} data - Reset data containing token and new password
 * @returns {Promise<object>} Response message
 */
export const resetPassword = async data => {
  return await apiClient.post('/auth/reset-password', data)
}

/**
 * Refresh authentication token
 * @returns {Promise<{token: string, user: object}>} New token and user data
 */
export const refreshToken = async () => {
  return await apiClient.post('/auth/refresh')
}
