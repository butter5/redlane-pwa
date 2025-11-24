<script setup>
import { ref } from 'vue'

const appName = import.meta.env.VITE_APP_NAME || 'Red Lane'
const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100"
  >
    <div class="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 class="text-6xl font-bold text-primary-600 mb-4">
        {{ appName }}
      </h1>
      <p class="text-2xl text-gray-600 mb-8">Progressive Web App for Customs Duty Declarations</p>

      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-semibold text-gray-800 mb-4">Welcome to Vue 3 + Vite</h2>
        <div class="space-y-4">
          <button
            class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            @click="increment"
          >
            Count is {{ count }}
          </button>
          <p class="text-gray-600">
            Edit <code class="bg-gray-100 px-2 py-1 rounded">src/pages/HomePage.vue</code> to test
            HMR
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-primary-600 mb-2">📱 PWA Ready</h3>
          <p class="text-gray-600 text-sm">Installable progressive web app with offline support</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-primary-600 mb-2">🎨 Tailwind CSS</h3>
          <p class="text-gray-600 text-sm">Utility-first CSS framework for rapid UI development</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-primary-600 mb-2">⚡ Vite</h3>
          <p class="text-gray-600 text-sm">Lightning fast build tool with hot module replacement</p>
        </div>
      </div>
    </div>
  </div>
</template>
