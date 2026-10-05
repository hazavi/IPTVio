<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import {
  ListboxContent,
  ListboxFilter,
  ListboxItem,
  ListboxRoot,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { Check, ChevronsUpDown, Globe, Search } from 'lucide-vue-next'
import { useCountriesStore } from '@/stores/countries'
import { useCatalogStore } from '@/stores/catalog'
import Skeleton from '@/components/ui/Skeleton.vue'

const store = useCountriesStore()
const catalog = useCatalogStore()

const open = ref(false)
const query = ref('')
const listbox = useTemplateRef<{ highlightFirstItem: () => void }>('listbox')

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q
    ? store.countries.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q)
    : store.countries
})

watch(query, async () => {
  await nextTick()
  listbox.value?.highlightFirstItem()
})

watch(open, (v) => {
  if (!v) query.value = ''
})

function onSelect(code: unknown) {
  if (typeof code !== 'string') return
  store.select(code)
  open.value = false
}
</script>

<template>
  <Skeleton v-if="catalog.loading && !store.countries.length" class="h-9 w-full" />
  <PopoverRoot v-else v-model:open="open">
    <PopoverTrigger
      class="flex h-9 w-full items-center gap-2 rounded-xl border bg-card px-3 text-left text-sm transition-colors duration-150 hover:bg-accent"
      aria-label="Select country"
    >
      <template v-if="store.selected">
        <span class="text-base leading-none" aria-hidden="true">{{ store.selected.flag }}</span>
        <span class="flex-1 truncate font-medium">{{ store.selected.name }}</span>
      </template>
      <template v-else>
        <Globe class="size-4 text-muted-foreground" />
        <span class="flex-1 text-muted-foreground">Select a country</span>
      </template>
      <ChevronsUpDown class="size-4 text-muted-foreground" />
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        align="start"
        :side-offset="6"
        class="anim-pop z-50 w-(--reka-popover-trigger-width) min-w-64 overflow-hidden rounded-xl border bg-card shadow-lg"
      >
        <ListboxRoot
          ref="listbox"
          :model-value="store.selectedCode"
          highlight-on-hover
          @update:model-value="onSelect"
        >
          <div class="flex items-center gap-2 border-b px-3">
            <Search class="size-4 text-muted-foreground" />
            <ListboxFilter
              v-model="query"
              placeholder="Search countries..."
              auto-focus
              class="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ListboxContent class="max-h-72 overflow-y-auto p-1">
            <ListboxItem
              v-for="c in results"
              :key="c.code"
              :value="c.code"
              class="flex items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none data-highlighted:bg-accent"
            >
              <span class="text-base leading-none" aria-hidden="true">{{ c.flag }}</span>
              <span class="flex-1 truncate">{{ c.name }}</span>
              <span class="text-xs text-muted-foreground tabular-nums">{{ c.channelCount }}</span>
              <Check v-if="c.code === store.selectedCode" class="size-4 text-primary" />
            </ListboxItem>
            <p v-if="!results.length" class="px-2 py-6 text-center text-sm text-muted-foreground">
              No country found.
            </p>
          </ListboxContent>
        </ListboxRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
