import { storeToRefs } from 'pinia'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'

/**
 * Composable for accessing feature flags in components
 * Provides reactive flag state and methods for checking flags
 * @returns {object} Feature flag state and actions
 */
export const useFeatureFlags = () => {
  const featureFlagStore = useFeatureFlagStore()

  // Convert store state to refs for reactivity
  const { flags, isLoaded } = storeToRefs(featureFlagStore)

  // Expose actions
  const { isActive, refresh, getFlag } = featureFlagStore

  return {
    // State
    flags,
    isLoaded,
    // Actions
    isActive,
    refresh,
    getFlag,
  }
}
