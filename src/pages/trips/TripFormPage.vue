<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'trips' })
}
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">New Trip</h1>

      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-600 mb-4">Create a new trip and assign people to it.</p>
        <button
          class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          @click="goBack"
        >
          Back to Trips
        </button>
      </div>
    </div>
  </AppLayout>
</template>
