<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useFavoritesStore } from '@/stores/favorites'
import type { Channel } from '@/types/iptv'
import ChannelLogo from './ChannelLogo.vue'
import CountryFlag from './CountryFlag.vue'

const props = defineProps<{ channel: Channel; active: boolean; showCountry?: boolean }>()
const emit = defineEmits<{ select: [] }>()

const favorites = useFavoritesStore()
const isFavorite = computed(() => favorites.has(props.channel.id))
const category = computed(() => {
  const id = props.channel.categories[0]
  return id ? id.charAt(0).toUpperCase() + id.slice(1) : null
})
</script>

<template>
  <div class="group relative h-13 py-1">
    <RouterLink
      :to="{ name: 'watch', params: { countryCode: channel.country, channelId: channel.id } }"
      :aria-current="active ? 'true' : undefined"
      :class="
        cn(
          'flex h-full items-center gap-2.5 rounded-xl px-2 pr-10 transition-shadow duration-200 hover:nm-raised-xs',
          active && 'nm-inset-sm hover:nm-inset-sm',
        )
      "
      @click="emit('select')"
    >
      <ChannelLogo :name="channel.name" :src="channel.logo" class="size-8" />
      <span class="min-w-0 flex-1">
        <span
          :class="cn('flex items-center gap-1.5 text-sm font-medium', active && 'text-primary')"
        >
          <span
            v-if="active"
            class="size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_6px_1px_var(--primary)]"
            aria-hidden="true"
          />
          <span class="truncate">{{ channel.name }}</span>
        </span>
        <span
          v-if="category || showCountry"
          class="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground"
        >
          <CountryFlag v-if="showCountry" :code="channel.country" class="h-3 w-4" />
          {{ category }}
        </span>
      </span>
    </RouterLink>
    <button
      type="button"
      :class="
        cn(
          'absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition duration-200 hover:text-foreground',
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
