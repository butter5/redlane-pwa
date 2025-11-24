import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '@/pages/HomePage.vue'

describe('HomePage', () => {
  it('renders properly', () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })
    expect(wrapper.text()).toContain('Red Lane')
  })

  it('increments counter when button is clicked', async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.text()).toContain('Count is 0')

    await button.trigger('click')
    expect(button.text()).toContain('Count is 1')

    await button.trigger('click')
    expect(button.text()).toContain('Count is 2')
  })
})
