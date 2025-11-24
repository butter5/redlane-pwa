<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const { forgotPassword, isLoading } = useAuth()

const email = ref('')
const submitted = ref(false)
const error = ref('')
const fieldError = ref('')

const validateForm = () => {
  fieldError.value = ''

  if (!email.value) {
    fieldError.value = 'Email is required'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldError.value = 'Invalid email format'
    return false
  }

  return true
}

const handleSubmit = async () => {
  error.value = ''

  if (!validateForm()) {
    return
  }

  try {
    await forgotPassword(email.value)
    submitted.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send reset email. Please try again.'
  }
}
</script>

<template>
  <AuthLayout>
    <div>
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">Forgot your password?</h2>

      <!-- Instructions -->
      <p v-if="!submitted" class="text-sm text-gray-600 text-center mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <!-- Success Message -->
      <div v-if="submitted" class="mb-6">
        <div class="p-4 bg-green-50 border border-green-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Email sent successfully!</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>
                  A password reset link has been sent to <strong>{{ email }}</strong>. Please
                  check your inbox and follow the instructions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 text-center">
          <router-link to="/login" class="text-sm font-medium text-red-600 hover:text-red-500">
            Back to login
          </router-link>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Forgot Password Form -->
      <form v-if="!submitted" class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            :class="{ 'border-red-500': fieldError }"
          />
          <p v-if="fieldError" class="mt-1 text-sm text-red-600">{{ fieldError }}</p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Sending...</span>
            <span v-else>Send reset link</span>
          </button>
        </div>

        <!-- Back to Login Link -->
        <div class="text-center">
          <router-link to="/login" class="text-sm font-medium text-red-600 hover:text-red-500">
            Back to login
          </router-link>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
