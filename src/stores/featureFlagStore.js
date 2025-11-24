import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as featureFlagService from '@/services/featureFlagService'

export const useFeatureFlagStore = defineStore('featureFlag', () => {
  // State
  const flags = ref({})
  const isLoaded = ref(false)

  // Actions
  const fetchFlags = async () => {
    try {
      const response = await featureFlagService.getFlags()
      flags.value = response || {}
      isLoaded.value = true
    } catch (error) {
      console.error('Error fetching feature flags:', error)
      // Keep existing flags on error, but mark as loaded
      isLoaded.value = true
    }
  }

  /**
   * Check if a feature flag is enabled
   * Returns true only if the flag exists and is explicitly set to true
   * @param {string} flagKey - The flag key to check
   * @returns {boolean} - True if flag is enabled, false otherwise (fail-safe)
   */
  const isActive = flagKey => {
    // Default to OFF if flag not found (fail-safe)
    return flags.value[flagKey] === true
  }

  /**
   * Refresh feature flags from the API
   * Alias for fetchFlags for semantic clarity
   */
  const refresh = async () => {
    await fetchFlags()
  }

  // Getters
  /**
   * Get the raw value of a feature flag
   * Returns the actual value or false if not found
   * Use this if you need the actual value; use isActive() for boolean checks
   * @param {string} key - The flag key to retrieve
   * @returns {*} - The flag value or false if not found
   */
  const getFlag = key => {
    return flags.value[key] ?? false
  }

  return {
    // State
    flags,
    isLoaded,
    // Actions
    fetchFlags,
    isActive,
    refresh,
    // Getters
    getFlag,
  }
})
