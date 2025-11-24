<script setup>
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const router = useRouter()

const tripId = route.params.id

const goBack = () => {
  router.push({ name: 'trips-detail', params: { id: tripId } })
}
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Trip Legs</h1>

      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-600 mb-4">
          Manage legs for trip {{ tripId }}. Add flight segments and travel details.
        </p>
        <button
          class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          @click="goBack"
        >
          Back to Trip
        </button>
      </div>
    </div>
  </AppLayout>
</template>
