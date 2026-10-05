<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import { useResizeObserver, useScroll } from '@vueuse/core'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

export interface Chip {
  id: string | null
  name: string
}

const props = defineProps<{ items: Chip[] }>()
const model = defineModel<string | null>({ default: null })

const scroller = useTemplateRef<HTMLElement>('scroller')
const { arrivedState, measure } = useScroll(scroller)
useResizeObserver(scroller, measure)
watch(
  () => props.items,
  () => nextTick(measure),
)

function scrollBy(direction: -1 | 1) {
  const el = scroller.value
  if (el) el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' })
}

// Let a vertical mouse wheel scroll the row sideways.
function onWheel(e: WheelEvent) {
  const el = scroller.value
  if (!el || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
  const max = el.scrollWidth - el.clientWidth
  if (max <= 0) return
  e.preventDefault()
  el.scrollLeft += e.deltaY
}

const arrow =
  'absolute top-1/2 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-foreground'
</script>

<template>
  <div class="relative">
    <button
      v-if="!arrivedState.left"
      type="button"
      aria-label="Scroll categories left"
      :class="cn(arrow, 'left-0')"
      @click="scrollBy(-1)"
    >
      <ChevronLeft class="size-4" />
    </button>

    <div
      ref="scroller"
      role="group"
      aria-label="Categories"
      class="flex gap-1.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @wheel="onWheel"
    >
      <button
        v-for="chip in items"
        :key="chip.id ?? 'all'"
        type="button"
        :aria-pressed="model === chip.id"
        :class="
          cn(
            'shrink-0 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground',
            model === chip.id &&
              'bg-foreground text-background hover:bg-foreground hover:text-background',
          )
        "
        @click="model = chip.id"
      >
        {{ chip.name }}
      </button>
    </div>

    <button
      v-if="!arrivedState.right"
      type="button"
      aria-label="Scroll categories right"
      :class="cn(arrow, 'right-0')"
      @click="scrollBy(1)"
    >
      <ChevronRight class="size-4" />
    </button>
  </div>
</template>
