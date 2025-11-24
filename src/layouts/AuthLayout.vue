<script setup>
// AuthLayout - Clean layout for authentication pages
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Red Lane Branding -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-red-600 mb-2">Red Lane</h1>
        <p class="text-gray-600">Customs Declaration System</p>
      </div>

      <!-- Content Card -->
      <div class="bg-white shadow-xl rounded-lg p-8">
        <slot />
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-500">
        <p>&copy; 2024 Red Lane. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
