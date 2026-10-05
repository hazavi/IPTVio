<script setup lang="ts">
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import { usePlayerStore } from '@/stores/player'
import { useCountriesStore } from '@/stores/countries'
import ChannelLogo from '@/components/ChannelLogo.vue'
import CountryFlag from '@/components/CountryFlag.vue'

const player = usePlayerStore()
const countries = useCountriesStore()
const hint = computed(() =>
  countries.selected
    ? `Pick a channel from ${countries.selected.name} to start watching.`
    : 'Pick a country to start watching.',
)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col items-center gap-10 pt-6 text-center md:pt-14">
    <div class="space-y-5">
      <div class="mx-auto grid size-32 place-items-center rounded-full nm-raised">
        <div class="grid size-24 place-items-center rounded-full nm-inset">
          <img src="/logo.png" alt="" class="size-14" />
        </div>
      </div>
      <span
        class="mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase nm-inset-sm"
      >
        <span
          class="size-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_2px_var(--primary)]"
          aria-hidden="true"
        />
        On air
      </span>
      <h1 class="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        Live TV from <span class="text-primary">around the world</span>
      </h1>
      <p class="text-sm text-muted-foreground">{{ hint }}</p>
    </div>

    <section v-if="player.recent.length" class="w-full text-left" aria-labelledby="recent-heading">
      <h2
        id="recent-heading"
        class="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <Clock class="size-4" /> Recently watched
      </h2>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="c in player.recent" :key="c.id">
          <RouterLink
            :to="{ name: 'watch', params: { countryCode: c.country, channelId: c.id } }"
            class="flex items-center gap-3 rounded-2xl bg-background p-3 nm-raised-sm transition-shadow duration-200 hover:text-primary active:nm-inset-sm"
          >
            <ChannelLogo :name="c.name" :src="c.logo" />
            <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ c.name }}</span>
            <CountryFlag :code="c.country" />
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>
