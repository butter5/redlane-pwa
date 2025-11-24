import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginPage from './LoginPage.vue'
import * as authService from '@/services/authService'

vi.mock('@/services/authService')

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/auth/login', name: 'login', component: LoginPage },
      { path: '/auth/register', name: 'register', component: { template: '<div>Register</div>' } },
      { path: '/auth/forgot-password', name: 'forgot-password', component: { template: '<div>Forgot</div>' } },
      { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
    ],
  })
}

describe('LoginPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.find('h2').text()).toContain('Sign in')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('has email and password fields', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    expect(emailInput.attributes('placeholder')).toBeTruthy()
    expect(passwordInput.attributes('placeholder')).toBeTruthy()
  })

  it('has forgot password link', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const forgotLink = wrapper.find('a[href*="forgot"]')
    expect(forgotLink.exists()).toBe(true)
  })

  it('has sign up link', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const signUpLink = wrapper.find('a[href*="register"]')
    expect(signUpLink.exists()).toBe(true)
  })

  it('validates required email field', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Wait for validation
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Email is required')
  })

  it('validates email format', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalid-email')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Invalid email')
  })

  it('validates required password field', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Password is required')
  })

  it('submits form with valid credentials', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' },
    }
    authService.login.mockResolvedValue(mockResponse)

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('displays error on login failure', async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    })

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('wrongpassword')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Wait for error to display
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Invalid credentials')
  })

  it('disables submit button during loading', async () => {
    authService.login.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ token: 'test', user: {} }), 1000))
    )

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    const submitButton = wrapper.find('button[type="submit"]')

    expect(submitButton.attributes('disabled')).toBeUndefined()

    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('shows loading state during submission', async () => {
    authService.login.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ token: 'test', user: {} }), 1000))
    )

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Signing in')
  })
})
