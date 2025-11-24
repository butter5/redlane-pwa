<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const router = useRouter()

const goToAddPerson = () => {
  router.push({ name: 'people-new' })
}
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">People</h1>
        <button
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          @click="goToAddPerson"
        >
          Add Person
        </button>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-600">
          Manage people you can declare for. Add family members, friends, or others you'll be
          traveling with.
        </p>
      </div>
    </div>
  </AppLayout>
</template>
