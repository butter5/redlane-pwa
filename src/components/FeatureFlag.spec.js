import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import FeatureFlag from '@/components/FeatureFlag.vue'
import { useFeatureFlagStore } from '@/stores/featureFlagStore'

describe('FeatureFlag Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render slot content when flag is enabled', () => {
    const store = useFeatureFlagStore()
    store.flags = { ocr_processing: true }

    const wrapper = mount(FeatureFlag, {
      props: {
        flag: 'ocr_processing',
      },
      slots: {
        default: '<button>OCR Button</button>',
      },
    })

    expect(wrapper.html()).toContain('OCR Button')
  })

  it('should not render slot content when flag is disabled', () => {
    const store = useFeatureFlagStore()
    store.flags = { ocr_processing: false }

    const wrapper = mount(FeatureFlag, {
      props: {
        flag: 'ocr_processing',
      },
      slots: {
        default: '<button>OCR Button</button>',
      },
    })

    expect(wrapper.html()).not.toContain('OCR Button')
  })

  it('should not render slot content when flag does not exist (fail-safe)', () => {
    const store = useFeatureFlagStore()
    store.flags = {}

    const wrapper = mount(FeatureFlag, {
      props: {
        flag: 'non_existent_flag',
      },
      slots: {
        default: '<button>Test Button</button>',
      },
    })

    expect(wrapper.html()).not.toContain('Test Button')
  })

  it('should render fallback slot when flag is disabled', () => {
    const store = useFeatureFlagStore()
    store.flags = { ocr_processing: false }

    const wrapper = mount(FeatureFlag, {
      props: {
        flag: 'ocr_processing',
      },
      slots: {
        default: '<button>OCR Button</button>',
        fallback: '<p>Feature not available</p>',
      },
    })

    expect(wrapper.html()).not.toContain('OCR Button')
    expect(wrapper.html()).toContain('Feature not available')
  })

  it('should support invert prop to show content when flag is disabled', () => {
    const store = useFeatureFlagStore()
    store.flags = { maintenance_mode: false }

    const wrapper = mount(FeatureFlag, {
      props: {
        flag: 'maintenance_mode',
        invert: true,
      },
      slots: {
        default: '<div>App is running</div>',
      },
    })

    expect(wrapper.html()).toContain('App is running')
  })

  it('should hide content with invert prop when flag is enabled', () => {
    const store = useFeatureFlagStore()
    store.flags = { maintenance_mode: true }

    const wrapper = mount(FeatureFlag, {
      props: {
        flag: 'maintenance_mode',
        invert: true,
      },
      slots: {
        default: '<div>App is running</div>',
      },
    })

    expect(wrapper.html()).not.toContain('App is running')
  })

  it('should update when flag value changes', async () => {
    const store = useFeatureFlagStore()
    store.flags = { ocr_processing: false }

    const wrapper = mount(FeatureFlag, {
      props: {
        flag: 'ocr_processing',
      },
      slots: {
        default: '<button>OCR Button</button>',
      },
    })

    expect(wrapper.html()).not.toContain('OCR Button')

    // Enable the flag
    store.flags = { ocr_processing: true }
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('OCR Button')
  })
})
