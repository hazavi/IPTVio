<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useFavoritesStore } from '@/stores/favorites'
import type { Channel } from '@/types/iptv'
import ChannelLogo from './ChannelLogo.vue'

const props = defineProps<{ channel: Channel; active: boolean }>()
const emit = defineEmits<{ select: [] }>()

const favorites = useFavoritesStore()
const isFavorite = computed(() => favorites.has(props.channel.id))
const category = computed(() => {
  const id = props.channel.categories[0]
  return id ? id.charAt(0).toUpperCase() + id.slice(1) : null
})
</script>

<template>
  <div class="group relative h-13">
    <RouterLink
      :to="{ name: 'watch', params: { countryCode: channel.country, channelId: channel.id } }"
      :aria-current="active ? 'true' : undefined"
      :class="
        cn(
          'flex h-full items-center gap-2.5 rounded-lg px-2 pr-10 transition-colors duration-150 hover:bg-accent',
          active && 'bg-primary/10 hover:bg-primary/10',
        )
      "
      @click="emit('select')"
    >
      <ChannelLogo :name="channel.name" :src="channel.logo" class="size-9" />
      <span class="min-w-0 flex-1">
        <span :class="cn('block truncate text-sm font-medium', active && 'text-primary')">{{
          channel.name
        }}</span>
        <span v-if="category" class="block truncate text-xs text-muted-foreground">{{
          category
        }}</span>
      </span>
    </RouterLink>
    <button
      type="button"
      :class="
        cn(
          'absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition duration-150 hover:text-foreground',
          !isFavorite &&
            'pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:opacity-100',
        )
      "
      :aria-label="
        isFavorite ? `Remove ${channel.name} from favorites` : `Add ${channel.name} to favorites`
      "
      :aria-pressed="isFavorite"
      @click="favorites.toggle(channel.id)"
    >
      <Star class="size-4" :class="isFavorite && 'fill-amber-400 text-amber-400'" />
    </button>
  </div>
</template>
