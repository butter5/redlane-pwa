import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import TripsListPage from './TripsListPage.vue'

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/trips', name: 'trips', component: TripsListPage },
      { path: '/trips/new', name: 'trips-new', component: { template: '<div>New Trip</div>' } },
    ],
  })
}

describe('TripsListPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
  })

  it('renders trips list page correctly', () => {
    const wrapper = mount(TripsListPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('h1').text()).toBe('Trips')
    expect(wrapper.text()).toContain('Manage your trips and customs declarations')
  })

  it('has new trip button', () => {
    const wrapper = mount(TripsListPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const newButton = wrapper.find('button')
    expect(newButton.exists()).toBe(true)
    expect(newButton.text()).toBe('New Trip')
  })
})
