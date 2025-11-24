<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const { currentUser, logout } = useAuth()
const router = useRouter()
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-red-600">Red Lane</h1>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8">
            <router-link
              to="/dashboard"
              class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </router-link>
            <router-link
              to="/declarations"
              class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Declarations
            </router-link>
          </nav>

          <!-- User Menu -->
          <div class="hidden md:flex items-center">
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full">
                <div class="flex items-center space-x-3 px-3 py-2">
                  <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-medium">
                    {{ currentUser?.firstName?.charAt(0) || 'U' }}
                  </div>
                  <span class="text-gray-700 font-medium">
                    {{ currentUser?.firstName || 'User' }}
                  </span>
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </MenuButton>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <router-link
                      to="/profile"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      Profile
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                      @click="handleLogout"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              class="text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-2"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-3">
          <div class="space-y-1">
            <router-link
              to="/dashboard"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </router-link>
            <router-link
              to="/declarations"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
              @click="mobileMenuOpen = false"
            >
              Declarations
            </router-link>
            <router-link
              to="/profile"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
              @click="mobileMenuOpen = false"
            >
              Profile
            </router-link>
            <button
              class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
