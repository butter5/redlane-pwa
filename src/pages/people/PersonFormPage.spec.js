import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import PersonFormPage from './PersonFormPage.vue'

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/people', name: 'people', component: { template: '<div>People</div>' } },
      { path: '/people/new', name: 'people-new', component: PersonFormPage },
      { path: '/people/:id', name: 'people-edit', component: PersonFormPage },
    ],
  })
}

describe('PersonFormPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
  })

  it('renders add person page correctly', async () => {
    await router.push('/people/new')
    
    const wrapper = mount(PersonFormPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('h1').text()).toBe('Add Person')
    expect(wrapper.text()).toContain('Add a new person to declare for')
  })

  it('renders edit person page correctly', async () => {
    await router.push('/people/123')
    
    const wrapper = mount(PersonFormPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('h1').text()).toBe('Edit Person')
    expect(wrapper.text()).toContain('Edit person details')
  })

  it('has back button', async () => {
    await router.push('/people/new')
    
    const wrapper = mount(PersonFormPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const backButton = wrapper.find('button')
    expect(backButton.exists()).toBe(true)
    expect(backButton.text()).toBe('Back to People')
  })
})
