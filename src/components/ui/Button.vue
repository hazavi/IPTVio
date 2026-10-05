<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const variants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border bg-card hover:bg-accent',
        ghost: 'hover:bg-accent',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3 text-xs',
        icon: 'size-9',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type Variants = VariantProps<typeof variants>

const props = withDefaults(
  defineProps<{
    variant?: Variants['variant']
    size?: Variants['size']
    class?: HTMLAttributes['class']
    type?: 'button' | 'submit'
  }>(),
  { type: 'button' },
)

const classes = computed(() =>
  cn(variants({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
  <button :type="type" :class="classes">
    <slot />
  </button>
</template>
