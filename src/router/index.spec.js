import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

// Import router config (we'll create a factory function)
const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: { template: '<div>Home</div>' },
        meta: { title: 'Home' },
      },
      {
        path: '/login',
        name: 'login',
        component: { template: '<div>Login</div>' },
        meta: { title: 'Login', requiresGuest: true },
      },
      {
        path: '/register',
        name: 'register',
        component: { template: '<div>Register</div>' },
        meta: { title: 'Register', requiresGuest: true },
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: { template: '<div>Dashboard</div>' },
        meta: { title: 'Dashboard', requiresAuth: true },
      },
    ],
  })
}

describe('Router Guards', () => {
  let router
  let pinia
  let authStore

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
    router = createTestRouter()
    localStorage.clear()
    vi.clearAllMocks()

    // Add navigation guard
    router.beforeEach((to, from, next) => {
      const isAuthenticated = authStore.isAuthenticated

      if (to.meta.requiresAuth && !isAuthenticated) {
        next({
          name: 'login',
          query: { redirect: to.fullPath },
        })
      } else if (to.meta.requiresGuest && isAuthenticated) {
        next({ name: 'dashboard' })
      } else {
        next()
      }
    })
  })

  describe('requiresAuth guard', () => {
    it('should allow access to protected route when authenticated', async () => {
      // Set up authenticated state
      authStore.user = { id: 1, email: 'test@example.com' }
      authStore.token = 'valid-token'

      await router.push('/dashboard')
      
      expect(router.currentRoute.value.name).toBe('dashboard')
    })

    it('should redirect to login when accessing protected route unauthenticated', async () => {
      // Not authenticated
      expect(authStore.isAuthenticated).toBe(false)

      await router.push('/dashboard')

      expect(router.currentRoute.value.name).toBe('login')
      expect(router.currentRoute.value.query.redirect).toBe('/dashboard')
    })

    it('should preserve redirect query parameter', async () => {
      await router.push('/dashboard')

      expect(router.currentRoute.value.query.redirect).toBe('/dashboard')
    })
  })

  describe('requiresGuest guard', () => {
    it('should allow access to guest route when not authenticated', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      await router.push('/login')

      expect(router.currentRoute.value.name).toBe('login')
    })

    it('should redirect to dashboard when accessing guest route while authenticated', async () => {
      // Set up authenticated state
      authStore.user = { id: 1, email: 'test@example.com' }
      authStore.token = 'valid-token'

      await router.push('/login')

      expect(router.currentRoute.value.name).toBe('dashboard')
    })

    it('should redirect from register page to dashboard when authenticated', async () => {
      authStore.user = { id: 1, email: 'test@example.com' }
      authStore.token = 'valid-token'

      await router.push('/register')

      expect(router.currentRoute.value.name).toBe('dashboard')
    })
  })

  describe('public routes', () => {
    it('should allow access to home page without authentication', async () => {
      await router.push('/')

      expect(router.currentRoute.value.name).toBe('home')
    })

    it('should allow access to home page when authenticated', async () => {
      authStore.user = { id: 1, email: 'test@example.com' }
      authStore.token = 'valid-token'

      await router.push('/')

      expect(router.currentRoute.value.name).toBe('home')
    })
  })

  describe('navigation flow', () => {
    it('should redirect to intended page after login', async () => {
      // Try to access protected page while not authenticated
      await router.push('/dashboard')
      expect(router.currentRoute.value.name).toBe('login')
      expect(router.currentRoute.value.query.redirect).toBe('/dashboard')

      // Simulate login
      authStore.user = { id: 1, email: 'test@example.com' }
      authStore.token = 'valid-token'

      // Now navigate to dashboard using redirect
      const redirectPath = router.currentRoute.value.query.redirect
      await router.push(redirectPath)

      expect(router.currentRoute.value.name).toBe('dashboard')
    })

    it('should not allow authenticated user to access login page', async () => {
      authStore.user = { id: 1, email: 'test@example.com' }
      authStore.token = 'valid-token'

      await router.push('/login')

      expect(router.currentRoute.value.name).not.toBe('login')
      expect(router.currentRoute.value.name).toBe('dashboard')
    })
  })
})
