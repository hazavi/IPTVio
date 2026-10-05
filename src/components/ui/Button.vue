<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const variants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-[box-shadow,background-color,color,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground nm-primary hover:brightness-110 active:translate-y-px active:brightness-95',
        outline:
          'bg-background text-muted-foreground nm-raised-sm hover:text-foreground active:nm-inset-sm aria-pressed:nm-inset-sm aria-pressed:text-primary',
        ghost: 'text-muted-foreground hover:text-foreground hover:nm-raised-xs active:nm-inset-sm',
        overlay: 'text-white hover:bg-white/15',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-8 px-3 text-xs',
        icon: 'size-10',
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
