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
      path: '/auth/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { title: 'Login', requiresGuest: true },
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/pages/auth/RegisterPage.vue'),
      meta: { title: 'Register', requiresGuest: true },
    },
    {
      path: '/auth/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      meta: { title: 'Forgot Password', requiresGuest: true },
    },
    {
      path: '/auth/reset-password/:token',
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
    // People routes (protected)
    {
      path: '/people',
      name: 'people',
      component: () => import('@/pages/people/PeopleListPage.vue'),
      meta: { title: 'People', requiresAuth: true },
    },
    {
      path: '/people/new',
      name: 'people-new',
      component: () => import('@/pages/people/PersonFormPage.vue'),
      meta: { title: 'Add Person', requiresAuth: true },
    },
    {
      path: '/people/:id',
      name: 'people-edit',
      component: () => import('@/pages/people/PersonFormPage.vue'),
      meta: { title: 'Edit Person', requiresAuth: true },
    },
    // Trips routes (protected)
    {
      path: '/trips',
      name: 'trips',
      component: () => import('@/pages/trips/TripsListPage.vue'),
      meta: { title: 'Trips', requiresAuth: true },
    },
    {
      path: '/trips/new',
      name: 'trips-new',
      component: () => import('@/pages/trips/TripFormPage.vue'),
      meta: { title: 'New Trip', requiresAuth: true },
    },
    {
      path: '/trips/:id',
      name: 'trips-detail',
      component: () => import('@/pages/trips/TripDetailPage.vue'),
      meta: { title: 'Trip Details', requiresAuth: true },
    },
    {
      path: '/trips/:id/items',
      name: 'trips-items',
      component: () => import('@/pages/trips/TripItemsPage.vue'),
      meta: { title: 'Trip Items', requiresAuth: true },
    },
    {
      path: '/trips/:id/legs',
      name: 'trips-legs',
      component: () => import('@/pages/trips/TripLegsPage.vue'),
      meta: { title: 'Trip Legs', requiresAuth: true },
    },
    {
      path: '/trips/:id/duty',
      name: 'trips-duty',
      component: () => import('@/pages/trips/TripDutyPage.vue'),
      meta: { title: 'Duty Summary', requiresAuth: true },
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
    
    // If flags haven't been loaded yet, wait for them to load before checking
    if (!featureFlagStore.isLoaded) {
      featureFlagStore.fetchFlags().then(() => {
        if (!featureFlagStore.isActive(featureFlag)) {
          next({ name: 'not-found' })
        } else {
          // Continue with auth checks
          checkAuthAndProceed(to, isAuthenticated, next)
        }
      })
      return
    }
    
    if (!featureFlagStore.isActive(featureFlag)) {
      // Redirect to 404 if feature is disabled
      next({ name: 'not-found' })
      return
    }
  }

  checkAuthAndProceed(to, isAuthenticated, next)
})

// Helper function to check authentication requirements
function checkAuthAndProceed(to, isAuthenticated, next) {
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
}

export default router
