<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const route = useRoute()
const { resetPassword, isLoading } = useAuth()

const password = ref('')
const confirmPassword = ref('')
const errors = ref({})
const errorMessage = ref('')
const success = ref(false)

const token = computed(() => route.params.token)

const validateForm = () => {
  errors.value = {}

  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  try {
    await resetPassword({
      token: token.value,
      password: password.value,
    })

    success.value = true

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Failed to reset password. Please try again or request a new reset link.'
  }
}
</script>

<template>
  <AuthLayout>
    <div>
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">Reset your password</h2>

      <!-- Instructions -->
      <p v-if="!success" class="text-sm text-gray-600 text-center mb-6">
        Enter your new password below.
      </p>

      <!-- Success Message -->
      <div v-if="success" class="mb-6">
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
              <h3 class="text-sm font-medium text-green-800">Password reset successful!</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Your password has been reset. You will be redirected to login shortly...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Reset Password Form -->
      <form v-if="!success" class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="At least 6 characters"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Re-enter your new password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Resetting password...</span>
            <span v-else>Reset password</span>
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
