<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ name: string; src: string | null; class?: string }>()

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <div
    :class="
      cn(
        'grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-white',
        $props.class,
      )
    "
  >
    <img
      v-if="src && !failed"
      :src="src"
      :alt="''"
      loading="lazy"
      referrerpolicy="no-referrer"
      class="size-full object-contain p-1"
      @error="failed = true"
    />
    <span v-else class="text-xs font-semibold text-zinc-500" aria-hidden="true">{{
      initials
    }}</span>
  </div>
</template>
