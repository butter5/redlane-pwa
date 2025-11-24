import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

/**
 * Composable for accessing authentication state and actions
 * Provides reactive auth state and methods for component usage
 * @returns {object} Auth state and actions
 */
export const useAuth = () => {
  const authStore = useAuthStore()

  // Convert store state to refs for reactivity
  const { user, token, isLoading, isAuthenticated, currentUser } = storeToRefs(authStore)

  // Expose all auth actions
  const {
    login,
    register,
    logout,
    getAuthenticatedUser,
    refreshToken,
    forgotPassword,
    resetPassword,
  } = authStore

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
}
