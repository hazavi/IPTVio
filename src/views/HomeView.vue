<script setup lang="ts">
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import { usePlayerStore } from '@/stores/player'
import { useCountriesStore } from '@/stores/countries'
import ChannelLogo from '@/components/ChannelLogo.vue'

const player = usePlayerStore()
const countries = useCountriesStore()
const hint = computed(() =>
  countries.selected
    ? `Pick a channel from ${countries.selected.name} to start watching.`
    : 'Pick a country to start watching.',
)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col items-center gap-6 pt-4 text-center md:pt-12">
    <div class="space-y-3">
      <img src="/logo.png" alt="" class="mx-auto size-16" />
      <h1 class="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
        Live TV from around the world
      </h1>
      <p class="text-sm text-muted-foreground">{{ hint }}</p>
    </div>

    <section v-if="player.recent.length" class="w-full text-left" aria-labelledby="recent-heading">
      <h2
        id="recent-heading"
        class="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <Clock class="size-4" /> Recently watched
      </h2>
      <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="c in player.recent" :key="c.id">
          <RouterLink
            :to="{ name: 'watch', params: { countryCode: c.country, channelId: c.id } }"
            class="flex items-center gap-2.5 rounded-xl border bg-card p-2 transition-colors duration-150 hover:bg-accent"
          >
            <ChannelLogo :name="c.name" :src="c.logo" />
            <span class="truncate text-sm font-medium">{{ c.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>
