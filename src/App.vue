<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'
import { useAuthStore } from '@/stores/authStore'

const featureFlagStore = useFeatureFlagStore()
const authStore = useAuthStore()

// Feature flag refresh interval (5 minutes in milliseconds)
const FLAG_REFRESH_INTERVAL = 5 * 60 * 1000

let refreshInterval = null

// Fetch feature flags on app mount
onMounted(async () => {
  await featureFlagStore.fetchFlags()
  
  // Set up periodic refresh every 5 minutes
  refreshInterval = setInterval(() => {
    featureFlagStore.refresh()
  }, FLAG_REFRESH_INTERVAL)
})

// Clean up interval on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// Refresh flags after login
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated, wasAuthenticated) => {
    // Only refresh when transitioning from not authenticated to authenticated
    if (isAuthenticated && !wasAuthenticated) {
      featureFlagStore.refresh()
    }
  }
)
</script>

<template>
  <div id="app" class="min-h-screen">
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
