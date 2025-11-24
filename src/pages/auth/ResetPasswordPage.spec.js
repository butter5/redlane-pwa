import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ResetPasswordPage from './ResetPasswordPage.vue'
import * as authService from '@/services/authService'

vi.mock('@/services/authService')

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/reset-password/:token', name: 'reset-password', component: ResetPasswordPage },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
    ],
  })
}

describe('ResetPasswordPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders reset password form correctly', async () => {
    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.find('h2').text()).toContain('Reset')
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('has password and confirm password fields', async () => {
    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const passwordInputs = wrapper.findAll('input[type="password"]')
    expect(passwordInputs.length).toBe(2)
  })

  it('validates required password field', async () => {
    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Password is required')
  })

  it('validates password length', async () => {
    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('at least 6 characters')
  })

  it('validates password match', async () => {
    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('different')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('submits form with valid password and token', async () => {
    authService.resetPassword.mockResolvedValue({ message: 'Password reset successful' })
    
    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('newpassword123')
    await passwordInputs[1].setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(authService.resetPassword).toHaveBeenCalledWith({
      token: 'test-token-123',
      password: 'newpassword123',
    })
  })

  it('displays error on invalid or expired token', async () => {
    authService.resetPassword.mockRejectedValue({
      response: { data: { message: 'Invalid or expired token' } },
    })

    await router.push('/reset-password/invalid-token')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('newpassword123')
    await passwordInputs[1].setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Invalid or expired token')
  })

  it('disables submit button during loading', async () => {
    authService.resetPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 1000))
    )

    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('newpassword123')
    await passwordInputs[1].setValue('newpassword123')

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('shows success message after reset', async () => {
    authService.resetPassword.mockResolvedValue({ message: 'Password reset successful' })

    await router.push('/reset-password/test-token-123')

    const wrapper = mount(ResetPasswordPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('newpassword123')
    await passwordInputs[1].setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Password reset successful')
  })
})
