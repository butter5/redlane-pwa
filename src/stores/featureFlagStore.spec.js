import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'
import * as featureFlagService from '@/services/featureFlagService'

// Mock the feature flag service
vi.mock('@/services/featureFlagService')

describe('featureFlagStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have empty flags object initially', () => {
      const store = useFeatureFlagStore()
      expect(store.flags).toEqual({})
    })

    it('should not be loaded initially', () => {
      const store = useFeatureFlagStore()
      expect(store.isLoaded).toBe(false)
    })
  })

  describe('fetchFlags Action', () => {
    it('should fetch flags from service and update state', async () => {
      const store = useFeatureFlagStore()
      const mockFlags = {
        ocr_processing: true,
        advanced_analytics: false,
        new_dashboard: true,
      }

      featureFlagService.getFlags.mockResolvedValue(mockFlags)

      await store.fetchFlags()

      expect(featureFlagService.getFlags).toHaveBeenCalledTimes(1)
      expect(store.flags).toEqual(mockFlags)
      expect(store.isLoaded).toBe(true)
    })

    it('should set isLoaded to true even on error', async () => {
      const store = useFeatureFlagStore()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      featureFlagService.getFlags.mockRejectedValue(new Error('Network error'))

      await store.fetchFlags()

      expect(store.isLoaded).toBe(true)
      expect(store.flags).toEqual({})
      
      consoleErrorSpy.mockRestore()
    })

    it('should handle null response from service', async () => {
      const store = useFeatureFlagStore()

      featureFlagService.getFlags.mockResolvedValue(null)

      await store.fetchFlags()

      expect(store.flags).toEqual({})
      expect(store.isLoaded).toBe(true)
    })
  })

  describe('isActive Method', () => {
    it('should return true for enabled flags', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: true,
        advanced_analytics: false,
      }

      expect(store.isActive('ocr_processing')).toBe(true)
    })

    it('should return false for disabled flags', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: true,
        advanced_analytics: false,
      }

      expect(store.isActive('advanced_analytics')).toBe(false)
    })

    it('should return false for non-existent flags (fail-safe)', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: true,
      }

      expect(store.isActive('non_existent_flag')).toBe(false)
    })

    it('should return false for undefined flags', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: undefined,
      }

      expect(store.isActive('ocr_processing')).toBe(false)
    })

    it('should return false for null flags', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: null,
      }

      expect(store.isActive('ocr_processing')).toBe(false)
    })
  })

  describe('refresh Method', () => {
    it('should call fetchFlags', async () => {
      const store = useFeatureFlagStore()
      const mockFlags = { feature1: true }

      featureFlagService.getFlags.mockResolvedValue(mockFlags)

      await store.refresh()

      expect(featureFlagService.getFlags).toHaveBeenCalledTimes(1)
      expect(store.flags).toEqual(mockFlags)
    })
  })

  describe('getFlag Getter', () => {
    it('should return flag value if it exists', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: true,
        advanced_analytics: false,
      }

      expect(store.getFlag('ocr_processing')).toBe(true)
      expect(store.getFlag('advanced_analytics')).toBe(false)
    })

    it('should return false for non-existent flags', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: true,
      }

      expect(store.getFlag('non_existent')).toBe(false)
    })

    it('should return false for undefined flags', () => {
      const store = useFeatureFlagStore()
      store.flags = {
        ocr_processing: undefined,
      }

      expect(store.getFlag('ocr_processing')).toBe(false)
    })
  })

  describe('Flag Updates', () => {
    it('should update flags on refresh', async () => {
      const store = useFeatureFlagStore()
      const initialFlags = { feature1: true }
      const updatedFlags = { feature1: false, feature2: true }

      featureFlagService.getFlags.mockResolvedValueOnce(initialFlags)
      await store.fetchFlags()
      expect(store.flags).toEqual(initialFlags)

      featureFlagService.getFlags.mockResolvedValueOnce(updatedFlags)
      await store.refresh()
      expect(store.flags).toEqual(updatedFlags)
    })
  })
})
