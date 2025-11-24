<script setup>
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const router = useRouter()

const personId = route.params.id
const isEditMode = !!personId

const goBack = () => {
  router.push({ name: 'people' })
}
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ isEditMode ? 'Edit Person' : 'Add Person' }}
      </h1>

      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-600 mb-4">
          {{ isEditMode ? 'Edit person details' : 'Add a new person to declare for' }}
        </p>
        <button
          class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          @click="goBack"
        >
          Back to People
        </button>
      </div>
    </div>
  </AppLayout>
</template>
