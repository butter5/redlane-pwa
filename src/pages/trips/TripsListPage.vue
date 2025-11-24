<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const router = useRouter()

const goToNewTrip = () => {
  router.push({ name: 'trips-new' })
}
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Trips</h1>
        <button
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          @click="goToNewTrip"
        >
          New Trip
        </button>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-600">
          Manage your trips and customs declarations. Create a new trip to start tracking items
          and duty calculations.
        </p>
      </div>
    </div>
  </AppLayout>
</template>
