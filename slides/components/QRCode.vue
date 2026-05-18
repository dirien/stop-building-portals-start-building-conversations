<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

withDefaults(
  defineProps<{
    value: string
    size?: number
    renderAs?: 'canvas' | 'svg'
    level?: 'L' | 'M' | 'Q' | 'H'
  }>(),
  {
    size: 110,
    renderAs: 'svg',
    level: 'M',
  },
)
</script>

<template>
  <QrcodeVue :value="value" :size="size" :render-as="renderAs" :level="level" />
</template>
