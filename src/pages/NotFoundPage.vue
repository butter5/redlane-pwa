<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-600 mb-4">404</h1>
      <h2 class="text-4xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <button
        class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        @click="goHome"
      >
        Go Home
      </button>
    </div>
  </div>
</template>
