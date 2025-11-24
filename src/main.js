import { createApp } from 'vue'
import router from './router'
import pinia from './stores'
import { useAuthStore } from './stores/authStore'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

// Auto-load user if token exists
const authStore = useAuthStore()
if (authStore.token) {
  authStore.getAuthenticatedUser().catch(() => {
    // If auto-load fails, user will be redirected to login by the store
    console.log('Auto-load user failed, token cleared')
  })
}

app.mount('#app')
