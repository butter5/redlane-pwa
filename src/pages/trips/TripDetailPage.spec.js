import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import TripDetailPage from './TripDetailPage.vue'

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/trips', name: 'trips', component: { template: '<div>Trips</div>' } },
      { path: '/trips/:id', name: 'trips-detail', component: TripDetailPage },
      { path: '/trips/:id/items', name: 'trips-items', component: { template: '<div>Items</div>' } },
      { path: '/trips/:id/legs', name: 'trips-legs', component: { template: '<div>Legs</div>' } },
      { path: '/trips/:id/duty', name: 'trips-duty', component: { template: '<div>Duty</div>' } },
    ],
  })
}

describe('TripDetailPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
  })

  it('renders trip detail page correctly', async () => {
    await router.push('/trips/123')
    
    const wrapper = mount(TripDetailPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('h1').text()).toBe('Trip Details')
    expect(wrapper.text()).toContain('Trip ID: 123')
  })

  it('has view items button', async () => {
    await router.push('/trips/123')
    
    const wrapper = mount(TripDetailPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const itemsButton = buttons.find(b => b.text() === 'View Items')
    expect(itemsButton).toBeTruthy()
  })

  it('has view legs button', async () => {
    await router.push('/trips/123')
    
    const wrapper = mount(TripDetailPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const legsButton = buttons.find(b => b.text() === 'View Legs')
    expect(legsButton).toBeTruthy()
  })

  it('has duty summary button', async () => {
    await router.push('/trips/123')
    
    const wrapper = mount(TripDetailPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const dutyButton = buttons.find(b => b.text() === 'Duty Summary')
    expect(dutyButton).toBeTruthy()
  })

  it('has back button', async () => {
    await router.push('/trips/123')
    
    const wrapper = mount(TripDetailPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const backButton = buttons.find(b => b.text() === 'Back to Trips')
    expect(backButton).toBeTruthy()
  })
})
