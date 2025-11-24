<script setup>
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const router = useRouter()

const tripId = route.params.id

const goToItems = () => {
  router.push({ name: 'trips-items', params: { id: tripId } })
}

const goToLegs = () => {
  router.push({ name: 'trips-legs', params: { id: tripId } })
}

const goToDuty = () => {
  router.push({ name: 'trips-duty', params: { id: tripId } })
}

const goBack = () => {
  router.push({ name: 'trips' })
}
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Trip Details</h1>

      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <p class="text-gray-600">Trip ID: {{ tripId }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
          @click="goToItems"
        >
          View Items
        </button>
        <button
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
          @click="goToLegs"
        >
          View Legs
        </button>
        <button
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
          @click="goToDuty"
        >
          Duty Summary
        </button>
      </div>

      <div class="mt-6">
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
