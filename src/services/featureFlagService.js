import apiClient from './apiClient'

/**
 * Fetches all feature flags from the backend API
 * @returns {Promise<Object>} Object mapping flag keys to boolean values
 */
export const getFlags = async () => {
  try {
    const response = await apiClient.get('/feature-flags')
    return response || {}
  } catch (error) {
    console.error('Failed to fetch feature flags:', error)
    // Return empty object on error (fail-safe)
    return {}
  }
}
