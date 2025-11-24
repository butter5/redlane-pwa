<script setup>
import { useFeatureFlags } from '@/composables/useFeatureFlags'

const props = defineProps({
  flag: {
    type: String,
    required: true,
  },
  invert: {
    type: Boolean,
    default: false,
  },
})

const { isActive } = useFeatureFlags()

const shouldShow = () => {
  const active = isActive(props.flag)
  return props.invert ? !active : active
}
</script>

<template>
  <div v-if="shouldShow()">
    <slot></slot>
  </div>
  <div v-else>
    <slot name="fallback"></slot>
  </div>
</template>
