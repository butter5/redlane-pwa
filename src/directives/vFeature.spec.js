import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { vFeature } from '@/directives/vFeature'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'
import { defineComponent } from 'vue'

// Helper component to test directive
const TestComponent = defineComponent({
  directives: {
    feature: vFeature,
  },
  props: {
    flagName: {
      type: String,
      required: true,
    },
  },
  template: '<div v-feature="flagName">Content</div>',
})

describe('v-feature Directive', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should show element when flag is enabled', () => {
    const store = useFeatureFlagStore()
    store.flags = { test_feature: true }

    const wrapper = mount(TestComponent, {
      props: {
        flagName: 'test_feature',
      },
    })

    const element = wrapper.find('div')
    expect(element.isVisible()).toBe(true)
    expect(element.text()).toBe('Content')
  })

  it('should hide element when flag is disabled', () => {
    const store = useFeatureFlagStore()
    store.flags = { test_feature: false }

    const wrapper = mount(TestComponent, {
      props: {
        flagName: 'test_feature',
      },
    })

    const element = wrapper.find('div')
    expect(element.element.style.display).toBe('none')
  })

  it('should hide element when flag does not exist (fail-safe)', () => {
    const store = useFeatureFlagStore()
    store.flags = {}

    const wrapper = mount(TestComponent, {
      props: {
        flagName: 'non_existent_flag',
      },
    })

    const element = wrapper.find('div')
    expect(element.element.style.display).toBe('none')
  })

  it('should update element visibility when flag changes', async () => {
    const store = useFeatureFlagStore()
    store.flags = { test_feature: false }

    const wrapper = mount(TestComponent, {
      props: {
        flagName: 'test_feature',
      },
    })

    let element = wrapper.find('div')
    expect(element.element.style.display).toBe('none')

    // Enable the flag
    store.flags = { test_feature: true }
    await wrapper.vm.$forceUpdate()
    await wrapper.vm.$nextTick()

    element = wrapper.find('div')
    expect(element.element.style.display).toBe('')
  })
})
