<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useFavoritesStore } from '@/stores/favorites'
import type { Channel } from '@/types/iptv'
import Badge from '@/components/ui/Badge.vue'
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
  <div class="relative h-14">
    <RouterLink
      :to="{ name: 'watch', params: { countryCode: channel.country, channelId: channel.id } }"
      :aria-current="active ? 'true' : undefined"
      :class="
        cn(
          'flex h-full items-center gap-3 rounded-xl px-2 pr-11 transition-colors duration-150 hover:bg-accent',
          active && 'bg-accent',
        )
      "
      @click="emit('select')"
    >
      <ChannelLogo :name="channel.name" :src="channel.logo" />
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-medium">{{ channel.name }}</span>
        <Badge v-if="category" class="mt-0.5">{{ category }}</Badge>
      </span>
    </RouterLink>
    <button
      type="button"
      class="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-background hover:text-foreground"
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
