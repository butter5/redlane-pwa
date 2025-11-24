import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFeatureFlags } from '@/composables/useFeatureFlags'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'

describe('useFeatureFlags', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should provide reactive flags state', () => {
    const { flags } = useFeatureFlags()
    const store = useFeatureFlagStore()

    expect(flags.value).toEqual({})
    
    store.flags = { feature1: true }
    expect(flags.value).toEqual({ feature1: true })
  })

  it('should provide reactive isLoaded state', () => {
    const { isLoaded } = useFeatureFlags()
    const store = useFeatureFlagStore()

    expect(isLoaded.value).toBe(false)
    
    store.isLoaded = true
    expect(isLoaded.value).toBe(true)
  })

  it('should expose isActive method', () => {
    const { isActive } = useFeatureFlags()
    const store = useFeatureFlagStore()

    store.flags = { feature1: true, feature2: false }

    expect(isActive('feature1')).toBe(true)
    expect(isActive('feature2')).toBe(false)
    expect(isActive('non_existent')).toBe(false)
  })

  it('should expose refresh method', async () => {
    const { refresh } = useFeatureFlags()
    
    expect(typeof refresh).toBe('function')
  })

  it('should expose getFlag method', () => {
    const { getFlag } = useFeatureFlags()
    const store = useFeatureFlagStore()

    store.flags = { feature1: true, feature2: false }

    expect(getFlag('feature1')).toBe(true)
    expect(getFlag('feature2')).toBe(false)
    expect(getFlag('non_existent')).toBe(false)
  })
})
