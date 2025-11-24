import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getFlags } from '@/services/featureFlagService'
import apiClient from '@/services/apiClient'

// Mock the API client
vi.mock('@/services/apiClient')

describe('featureFlagService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getFlags', () => {
    it('should fetch feature flags from API', async () => {
      const mockFlags = {
        ocr_processing: true,
        advanced_analytics: false,
        new_dashboard: true,
      }

      apiClient.get.mockResolvedValue(mockFlags)

      const result = await getFlags()

      expect(apiClient.get).toHaveBeenCalledWith('/feature-flags')
      expect(result).toEqual(mockFlags)
    })

    it('should return empty object on API error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      apiClient.get.mockRejectedValue(new Error('Network error'))

      const result = await getFlags()

      expect(result).toEqual({})
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch feature flags:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle API returning null or undefined', async () => {
      apiClient.get.mockResolvedValue(null)

      const result = await getFlags()

      expect(result).toEqual({})
    })
  })
})
