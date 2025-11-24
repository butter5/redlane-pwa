import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'
import { useAuthStore } from '@/stores/authStore'

vi.mock('@/services/featureFlagService', () => ({
  getFlags: vi.fn().mockResolvedValue({}),
}))

describe('App.vue Feature Flag Integration', () => {
  let router
  let featureFlagStore
  let authStore

  beforeEach(() => {
    setActivePinia(createPinia())
    featureFlagStore = useFeatureFlagStore()
    authStore = useAuthStore()

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: { template: '<div>Home</div>' },
        },
      ],
    })

    vi.spyOn(featureFlagStore, 'fetchFlags')
    vi.spyOn(featureFlagStore, 'refresh')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch feature flags on mount', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(featureFlagStore.fetchFlags).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('should refresh flags after login', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()
    featureFlagStore.refresh.mockClear()

    // Simulate login (transition from not authenticated to authenticated)
    authStore.token = 'test-token'
    authStore.user = { id: 1, email: 'test@example.com' }

    await flushPromises()

    expect(featureFlagStore.refresh).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('should not refresh flags on logout', async () => {
    // Start with authenticated state
    authStore.token = 'test-token'
    authStore.user = { id: 1, email: 'test@example.com' }

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()
    featureFlagStore.refresh.mockClear()

    // Simulate logout
    authStore.token = null
    authStore.user = null

    await flushPromises()

    expect(featureFlagStore.refresh).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})

