import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import PeopleListPage from './PeopleListPage.vue'

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/people', name: 'people', component: PeopleListPage },
      { path: '/people/new', name: 'people-new', component: { template: '<div>New Person</div>' } },
    ],
  })
}

describe('PeopleListPage', () => {
  let router
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
  })

  it('renders people list page correctly', () => {
    const wrapper = mount(PeopleListPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('h1').text()).toBe('People')
    expect(wrapper.text()).toContain('Manage people you can declare for')
  })

  it('has add person button', () => {
    const wrapper = mount(PeopleListPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const addButton = wrapper.find('button')
    expect(addButton.exists()).toBe(true)
    expect(addButton.text()).toBe('Add Person')
  })
})
