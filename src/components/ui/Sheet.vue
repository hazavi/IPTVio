<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { X } from 'lucide-vue-next'

defineProps<{ title: string; description?: string }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="anim-fade fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
      <DialogContent
        class="anim-sheet fixed inset-x-0 bottom-0 z-50 flex h-[80dvh] flex-col rounded-t-3xl bg-background shadow-[0_-10px_30px_var(--nm-dark)]"
      >
        <div class="mx-auto mt-2 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        <header class="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <DialogTitle class="text-sm font-semibold">{{ title }}</DialogTitle>
            <DialogDescription class="sr-only">{{ description ?? title }}</DialogDescription>
          </div>
          <DialogClose
            class="grid size-8 place-items-center rounded-full text-muted-foreground nm-raised-xs active:nm-inset-sm"
            aria-label="Close"
          >
            <X class="size-4" />
          </DialogClose>
        </header>
        <div class="min-h-0 flex-1">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
