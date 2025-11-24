import { useFeatureFlagStore } from '@/stores/featureFlagStore'

/**
 * v-feature directive
 * Removes element if feature flag is disabled
 * Usage: v-feature="'ocr_processing'"
 */
export const vFeature = {
  mounted(el, binding) {
    const featureFlagStore = useFeatureFlagStore()
    const flagKey = binding.value
    
    if (!featureFlagStore.isActive(flagKey)) {
      // Remove the element if the feature is not active
      el.style.display = 'none'
    }
  },
  updated(el, binding) {
    const featureFlagStore = useFeatureFlagStore()
    const flagKey = binding.value
    
    if (!featureFlagStore.isActive(flagKey)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  },
}
