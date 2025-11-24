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

  const isActive = flagKey => {
    // Default to OFF if flag not found (fail-safe)
    return flags.value[flagKey] === true
  }

  const refresh = async () => {
    await fetchFlags()
  }

  // Getters
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
