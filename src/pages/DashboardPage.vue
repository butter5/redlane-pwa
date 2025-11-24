<script setup>
import { useAuth } from '@/composables/useAuth'
import AppLayout from '@/layouts/AppLayout.vue'

const { currentUser } = useAuth()
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Welcome, {{ currentUser?.firstName || 'User' }}!
        </h2>
        <p class="text-gray-600">
          You are now logged in to the Red Lane Customs Declaration System.
        </p>
      </div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Declarations</h3>
          <p class="text-3xl font-bold text-red-600">0</p>
          <p class="text-sm text-gray-500 mt-1">Total declarations</p>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Pending</h3>
          <p class="text-3xl font-bold text-yellow-600">0</p>
          <p class="text-sm text-gray-500 mt-1">Awaiting review</p>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Approved</h3>
          <p class="text-3xl font-bold text-green-600">0</p>
          <p class="text-sm text-gray-500 mt-1">Successfully processed</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
