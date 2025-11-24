import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import RegisterPage from './RegisterPage.vue'
import * as authService from '@/services/authService'

vi.mock('@/services/authService')

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/register', name: 'register', component: RegisterPage },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
      { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
    ],
  })
}

describe('RegisterPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders registration form correctly', () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.find('h2').text()).toContain('Create')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('has all required fields', () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('input#confirmPassword').exists()).toBe(true)
    expect(wrapper.find('input#firstName').exists()).toBe(true)
    expect(wrapper.find('input#lastName').exists()).toBe(true)
    expect(wrapper.find('input#phone').exists()).toBe(true)
  })

  it('has terms acceptance checkbox', () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const termsCheckbox = wrapper.find('input[type="checkbox"]')
    expect(termsCheckbox.exists()).toBe(true)
  })

  it('has login link', () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const loginLink = wrapper.find('a[href*="login"]')
    expect(loginLink.exists()).toBe(true)
  })

  it('validates required fields', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('required')
  })

  it('validates email format', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const emailInput = wrapper.find('input#email')
    await emailInput.setValue('invalid-email')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Invalid email')
  })

  it('validates password match', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('different')
    await wrapper.find('input#firstName').setValue('Test')
    await wrapper.find('input#lastName').setValue('User')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('validates password length', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.find('input#password').setValue('123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('at least 6 characters')
  })

  it('validates terms acceptance', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('input#firstName').setValue('Test')
    await wrapper.find('input#lastName').setValue('User')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('accept')
  })

  it('submits form with valid data', async () => {
    const mockResponse = {
      token: 'test-token',
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
      },
    }
    authService.register.mockResolvedValue(mockResponse)

    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('input#firstName').setValue('Test')
    await wrapper.find('input#lastName').setValue('User')
    await wrapper.find('input#phone').setValue('1234567890')
    await wrapper.find('input[type="checkbox"]').setValue(true)

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
    })
  })

  it('displays error on registration failure', async () => {
    authService.register.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    })

    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.find('input#email').setValue('existing@example.com')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('input#firstName').setValue('Test')
    await wrapper.find('input#lastName').setValue('User')
    await wrapper.find('input[type="checkbox"]').setValue(true)

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Email already exists')
  })

  it('disables submit button during loading', async () => {
    authService.register.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ token: 'test', user: {} }), 1000))
    )

    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('input#firstName').setValue('Test')
    await wrapper.find('input#lastName').setValue('User')
    await wrapper.find('input[type="checkbox"]').setValue(true)

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('shows loading state during submission', async () => {
    authService.register.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ token: 'test', user: {} }), 1000))
    )

    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('input#firstName').setValue('Test')
    await wrapper.find('input#lastName').setValue('User')
    await wrapper.find('input[type="checkbox"]').setValue(true)

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Creating')
  })
})
