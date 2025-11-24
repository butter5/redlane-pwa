import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
      meta: { title: 'Home' },
    },
    // Auth routes (public)
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { title: 'Login', requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/RegisterPage.vue'),
      meta: { title: 'Register', requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      meta: { title: 'Forgot Password', requiresGuest: true },
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: () => import('@/pages/auth/ResetPasswordPage.vue'),
      meta: { title: 'Reset Password', requiresGuest: true },
    },
    // Protected routes
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    // 404 - Keep as last route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: 'Not Found' },
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const featureFlagStore = useFeatureFlagStore()
  const isAuthenticated = authStore.isAuthenticated

  // Set page title
  document.title = `${to.meta.title || 'Red Lane'} - ${import.meta.env.VITE_APP_NAME}`

  // Check if route requires a specific feature flag
  if (to.meta.requiresFeature) {
    const featureFlag = to.meta.requiresFeature
    if (!featureFlagStore.isActive(featureFlag)) {
      // Redirect to 404 if feature is disabled
      next({ name: 'not-found' })
      return
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }
  // Check if route requires guest (unauthenticated user)
  else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next({ name: 'dashboard' })
  }
  // Allow navigation
  else {
    next()
  }
})

export default router
