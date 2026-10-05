<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ code: string; class?: string }>()

// Windows doesn't render flag emoji, so flags are loaded as images.
const failed = ref(false)
watch(
  () => props.code,
  () => (failed.value = false),
)

const src = computed(() => {
  const c = props.code.toLowerCase()
  return `https://flagcdn.com/${c === 'uk' ? 'gb' : c}.svg`
})
</script>

<template>
  <span
    :class="
      cn(
        'inline-grid h-4 w-[22px] shrink-0 place-items-center overflow-hidden rounded-[4px] bg-muted text-[8px] font-bold text-muted-foreground shadow-[0_1px_3px_var(--nm-dark)] ring-1 ring-black/10',
        $props.class,
      )
    "
    aria-hidden="true"
  >
    <img
      v-if="!failed"
      :src="src"
      alt=""
      loading="lazy"
      class="size-full object-cover"
      @error="failed = true"
    />
    <template v-else>{{ code }}</template>
  </span>
</template>
