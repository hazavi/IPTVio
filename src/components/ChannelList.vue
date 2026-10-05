<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDebounceFn, useVirtualList } from '@vueuse/core'
import { Search, Star, TvMinimal } from 'lucide-vue-next'
import { useCatalogStore } from '@/stores/catalog'
import { useChannelsStore } from '@/stores/channels'
import { useCountriesStore } from '@/stores/countries'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import CategoryChips from './CategoryChips.vue'
import ChannelCard from './ChannelCard.vue'

const emit = defineEmits<{ select: [] }>()

const route = useRoute()
const catalog = useCatalogStore()
const countries = useCountriesStore()
const channels = useChannelsStore()

const searchInput = ref(channels.search)
const applySearch = useDebounceFn((v: string) => (channels.search = v), 200)
watch(searchInput, applySearch)

const activeId = computed(() => (route.name === 'watch' ? String(route.params.channelId) : null))
const source = computed(() => channels.filtered)
const chips = computed(() => [{ id: null, name: 'All' }, ...channels.availableCategories])
const browsable = computed(() => channels.favoritesOnly || !!countries.selected)

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(source, {
  itemHeight: 52,
  overscan: 8,
})

watch(
  () => countries.selectedCode,
  () => {
    if (channels.favoritesOnly) return
    channels.resetFilters()
    searchInput.value = ''
  },
)
watch(source, () => scrollTo(0))

function toggleFavorites() {
  channels.favoritesOnly = !channels.favoritesOnly
  channels.category = null
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col gap-2.5">
    <div class="space-y-2.5">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <Search
            class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="searchInput"
            type="search"
            placeholder="Search channels"
            aria-label="Search channels"
            class="pl-9"
            :disabled="!browsable"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          class="size-10"
          :aria-pressed="channels.favoritesOnly"
          aria-label="Show favorites from all countries"
          title="Favorites from all countries"
          @click="toggleFavorites"
        >
          <Star :class="channels.favoritesOnly && 'fill-amber-400 text-amber-400'" />
        </Button>
      </div>

      <p
        v-if="channels.favoritesOnly"
        class="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground"
      >
        <Star class="size-3.5 fill-amber-400 text-amber-400" />
        Favorites from all countries
      </p>

      <CategoryChips v-if="browsable" v-model="channels.category" :items="chips" />
    </div>

    <div v-if="catalog.loading" class="space-y-2" aria-busy="true" aria-label="Loading channels">
      <Skeleton v-for="i in 8" :key="i" class="h-12" />
    </div>

    <div v-else-if="catalog.error" class="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <p class="text-sm text-muted-foreground">{{ catalog.error }}</p>
      <Button variant="outline" size="sm" @click="catalog.load()">Try again</Button>
    </div>

    <div
      v-else-if="!browsable"
      class="flex flex-col items-center gap-3 px-4 py-8 text-center text-sm text-muted-foreground"
    >
      <span class="grid size-14 place-items-center rounded-full nm-inset">
        <TvMinimal class="size-6" />
      </span>
      Select a country to browse its channels.
    </div>

    <div
      v-else-if="!channels.filtered.length"
      class="px-4 py-6 text-center text-sm text-muted-foreground"
    >
      {{
        channels.favoritesOnly && !channels.search && !channels.category
          ? 'No favorites yet. Tap the star on a channel to add it.'
          : 'No channels match your filters.'
      }}
    </div>

    <div
      v-else
      v-bind="containerProps"
      class="min-h-0 flex-1 px-1.5"
      role="list"
      aria-label="Channels"
    >
      <div v-bind="wrapperProps">
        <div v-for="item in list" :key="item.data.id" role="listitem" class="h-13">
          <ChannelCard
            :channel="item.data"
            :active="item.data.id === activeId"
            :show-country="channels.favoritesOnly"
            @select="emit('select')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
