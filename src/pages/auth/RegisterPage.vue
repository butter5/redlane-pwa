<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const { register, isLoading } = useAuth()

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
})
const termsAccepted = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

const validateForm = () => {
  errors.value = {}

  if (!formData.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  if (!formData.value.firstName) {
    errors.value.firstName = 'First name is required'
  }

  if (!formData.value.lastName) {
    errors.value.lastName = 'Last name is required'
  }

  if (!termsAccepted.value) {
    errors.value.terms = 'You must accept the terms and conditions'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  try {
    const userData = {
      email: formData.value.email,
      password: formData.value.password,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      phone: formData.value.phone,
    }

    await register(userData)
    
    successMessage.value = 'Account created successfully! Redirecting to dashboard...'
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.'
  }
}
</script>

<template>
  <AuthLayout>
    <div>
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-6">Create your account</h2>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <p class="text-sm text-green-600">{{ successMessage }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Registration Form -->
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Name Fields -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              autocomplete="given-name"
              placeholder="John"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              autocomplete="family-name"
              placeholder="Doe"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Phone Field -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            Phone number (optional)
          </label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            autocomplete="tel"
            placeholder="+1234567890"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <!-- Password Fields -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            autocomplete="new-password"
            placeholder="At least 6 characters"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Re-enter your password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Terms Acceptance -->
        <div>
          <div class="flex items-start">
            <input
              id="terms"
              v-model="termsAccepted"
              type="checkbox"
              class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-0.5"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I accept the
              <a href="/terms" class="text-red-600 hover:text-red-500">Terms and Conditions</a>
              and
              <a href="/privacy" class="text-red-600 hover:text-red-500">Privacy Policy</a>
            </label>
          </div>
          <p v-if="errors.terms" class="mt-1 text-sm text-red-600">{{ errors.terms }}</p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-red-600 hover:text-red-500">
              Sign in
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
