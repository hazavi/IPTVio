<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
const model = defineModel<string>()
</script>

<template>
  <input
    v-model="model"
    :class="
      cn(
        'h-10 w-full rounded-xl border bg-card px-3 text-sm transition-colors duration-150 placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:-outline-offset-1',
        $props.class,
      )
    "
  />
</template>
