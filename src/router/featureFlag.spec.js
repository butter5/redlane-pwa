import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'

describe('Router Feature Flag Integration', () => {
  let router
  let featureFlagStore

  beforeEach(() => {
    setActivePinia(createPinia())
    featureFlagStore = useFeatureFlagStore()

    // Create a test router with feature-gated route
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' },
        },
        {
          path: '/feature-page',
          name: 'feature-page',
          component: { template: '<div>Feature Page</div>' },
          meta: { requiresFeature: 'test_feature' },
        },
        {
          path: '/404',
          name: 'not-found',
          component: { template: '<div>Not Found</div>' },
        },
      ],
    })

    // Add the feature flag guard
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresFeature) {
        const featureFlag = to.meta.requiresFeature
        
        // If flags haven't been loaded yet, wait for them
        if (!featureFlagStore.isLoaded) {
          featureFlagStore.fetchFlags().then(() => {
            if (!featureFlagStore.isActive(featureFlag)) {
              next({ name: 'not-found' })
            } else {
              next()
            }
          })
          return
        }
        
        if (!featureFlagStore.isActive(featureFlag)) {
          next({ name: 'not-found' })
          return
        }
      }
      next()
    })
  })

  it('should allow navigation when feature flag is enabled', async () => {
    featureFlagStore.flags = { test_feature: true }
    featureFlagStore.isLoaded = true

    await router.push('/feature-page')

    expect(router.currentRoute.value.name).toBe('feature-page')
  })

  it('should redirect to 404 when feature flag is disabled', async () => {
    featureFlagStore.flags = { test_feature: false }
    featureFlagStore.isLoaded = true

    await router.push('/feature-page')

    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('should redirect to 404 when feature flag does not exist', async () => {
    featureFlagStore.flags = {}
    featureFlagStore.isLoaded = true

    await router.push('/feature-page')

    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('should allow navigation to routes without feature flag requirement', async () => {
    featureFlagStore.flags = {}
    featureFlagStore.isLoaded = true

    await router.push('/')

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('should wait for flags to load before checking feature requirements', async () => {
    // Start with flags not loaded
    featureFlagStore.isLoaded = false
    
    // Mock fetchFlags to simulate async loading
    vi.spyOn(featureFlagStore, 'fetchFlags').mockImplementation(async () => {
      featureFlagStore.flags = { test_feature: true }
      featureFlagStore.isLoaded = true
    })

    await router.push('/feature-page')

    expect(featureFlagStore.fetchFlags).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('feature-page')
  })

  it('should redirect to 404 after loading if flag is disabled', async () => {
    // Start with flags not loaded
    featureFlagStore.isLoaded = false
    
    // Mock fetchFlags to simulate async loading with disabled flag
    vi.spyOn(featureFlagStore, 'fetchFlags').mockImplementation(async () => {
      featureFlagStore.flags = { test_feature: false }
      featureFlagStore.isLoaded = true
    })

    await router.push('/feature-page')

    expect(featureFlagStore.fetchFlags).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
