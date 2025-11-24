import { describe, it, expect, beforeEach } from 'vitest'
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

    await router.push('/feature-page')

    expect(router.currentRoute.value.name).toBe('feature-page')
  })

  it('should redirect to 404 when feature flag is disabled', async () => {
    featureFlagStore.flags = { test_feature: false }

    await router.push('/feature-page')

    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('should redirect to 404 when feature flag does not exist', async () => {
    featureFlagStore.flags = {}

    await router.push('/feature-page')

    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('should allow navigation to routes without feature flag requirement', async () => {
    featureFlagStore.flags = {}

    await router.push('/')

    expect(router.currentRoute.value.name).toBe('home')
  })
})
