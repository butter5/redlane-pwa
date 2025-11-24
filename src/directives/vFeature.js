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
    
    // Store the original display value
    if (!el._vFeatureOriginalDisplay) {
      el._vFeatureOriginalDisplay = el.style.display || ''
    }
    
    if (!featureFlagStore.isActive(flagKey)) {
      // Hide the element if the feature is not active
      el.style.display = 'none'
    }
  },
  updated(el, binding) {
    const featureFlagStore = useFeatureFlagStore()
    const flagKey = binding.value
    
    if (!featureFlagStore.isActive(flagKey)) {
      el.style.display = 'none'
    } else {
      // Restore the original display value
      el.style.display = el._vFeatureOriginalDisplay || ''
    }
  },
  unmounted(el) {
    // Clean up the stored original display value
    delete el._vFeatureOriginalDisplay
  },
}
