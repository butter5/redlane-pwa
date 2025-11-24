import { createApp } from 'vue'
import router from './router'
import pinia from './stores'
import { useAuthStore } from './stores/authStore'
import { vFeature } from './directives/vFeature'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

// Register v-feature directive globally
app.directive('feature', vFeature)

// Auto-load user if token exists
const authStore = useAuthStore()
if (authStore.token) {
  authStore.getAuthenticatedUser().catch(() => {
    // If auto-load fails, user will be redirected to login by the store
    console.log('Auto-load user failed, token cleared')
  })
}

app.mount('#app')
