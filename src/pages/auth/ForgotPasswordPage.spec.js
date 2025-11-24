import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ForgotPasswordPage from './ForgotPasswordPage.vue'
import * as authService from '@/services/authService'

vi.mock('@/services/authService')

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
    ],
  })
}

describe('ForgotPasswordPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders forgot password form correctly', () => {
    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.find('h2').text()).toContain('Forgot')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('has back to login link', () => {
    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const loginLink = wrapper.find('a[href*="login"]')
    expect(loginLink.exists()).toBe(true)
  })

  it('validates required email field', async () => {
    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Email is required')
  })

  it('validates email format', async () => {
    const wrapper = mount(ForgotPasswordPage, {
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

  it('submits form with valid email', async () => {
    authService.forgotPassword.mockResolvedValue({ message: 'Email sent' })

    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com')
  })

  it('displays success message after submission', async () => {
    authService.forgotPassword.mockResolvedValue({ message: 'Email sent' })

    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('A password reset link has been sent')
  })

  it('displays error on submission failure', async () => {
    authService.forgotPassword.mockRejectedValue({
      response: { data: { message: 'Email not found' } },
    })

    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('notfound@example.com')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Email not found')
  })

  it('disables submit button during loading', async () => {
    authService.forgotPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ message: 'Email sent' }), 1000))
    )

    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('hides form after successful submission', async () => {
    authService.forgotPassword.mockResolvedValue({ message: 'Email sent' })

    const wrapper = mount(ForgotPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Form should be hidden
    expect(wrapper.find('input[type="email"]').exists()).toBe(false)
  })
})
