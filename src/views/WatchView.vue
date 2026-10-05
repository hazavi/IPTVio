<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ExternalLink, SearchX, Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useCatalogStore } from '@/stores/catalog'
import { useChannelsStore } from '@/stores/channels'
import { useCountriesStore } from '@/stores/countries'
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'
import ChannelLogo from '@/components/ChannelLogo.vue'
import CountryFlag from '@/components/CountryFlag.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

const props = defineProps<{ countryCode: string; channelId: string }>()

const router = useRouter()
const catalog = useCatalogStore()
const countries = useCountriesStore()
const channels = useChannelsStore()
const favorites = useFavoritesStore()
const player = usePlayerStore()

const channel = computed(() => catalog.getChannel(props.channelId))
const country = computed(() => countries.countries.find((c) => c.code === channel.value?.country))
const notFound = computed(
  () => !catalog.loading && !catalog.error && catalog.channels.length > 0 && !channel.value,
)

watch(
  channel,
  (c) => {
    if (!c) return
    countries.select(c.country)
    player.play(c)
  },
  { immediate: true },
)

function go(offset: number) {
  const list = channels.filtered
  if (!list.length) return
  const i = list.findIndex((c) => c.id === props.channelId)
  const next = list[(i + offset + list.length) % list.length]
  if (next)
    router.push({ name: 'watch', params: { countryCode: next.country, channelId: next.id } })
}
</script>

<template>
  <div class="mx-auto max-w-[88rem] space-y-3">
    <template v-if="channel">
      <VideoPlayer
        :src="player.currentStream?.url ?? null"
        :has-alternative="player.hasAlternative"
        @try-another="player.nextStream()"
        @prev-channel="go(-1)"
        @next-channel="go(1)"
      />

      <div class="space-y-3 rounded-3xl bg-background p-4 nm-raised">
        <section class="flex items-center gap-3" aria-label="Channel info">
          <ChannelLogo :name="channel.name" :src="channel.logo" class="size-11" />
          <div class="min-w-0 flex-1 space-y-1">
            <h1 class="truncate text-xl font-semibold tracking-tight">{{ channel.name }}</h1>
            <p class="flex items-center gap-1.5 truncate text-sm text-muted-foreground capitalize">
              <template v-if="country">
                <CountryFlag :code="country.code" />
                <span>{{ country.name }}</span>
              </template>
              <template v-if="channel.categories.length">
                · {{ channel.categories.join(', ') }}
              </template>
            </p>
          </div>
          <div class="flex gap-2">
            <a
              v-if="channel.website"
              :href="channel.website"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open channel website"
              class="inline-flex size-10 items-center justify-center rounded-xl bg-background text-muted-foreground nm-raised-sm transition-shadow duration-200 hover:text-primary active:nm-inset-sm"
            >
              <ExternalLink class="size-4" />
            </a>
            <Button
              variant="outline"
              size="icon"
              :aria-pressed="favorites.has(channel.id)"
              :aria-label="favorites.has(channel.id) ? 'Remove from favorites' : 'Add to favorites'"
              @click="favorites.toggle(channel.id)"
            >
              <Star :class="favorites.has(channel.id) && 'fill-amber-400 text-amber-400'" />
            </Button>
          </div>
        </section>

        <section
          v-if="channel.streams.length > 1"
          aria-labelledby="streams-heading"
          class="space-y-2.5 pt-3"
        >
          <h2
            id="streams-heading"
            class="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Streams
          </h2>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="(s, i) in channel.streams"
              :key="s.url"
              type="button"
              :aria-pressed="player.streamIndex === i"
              :class="
                cn(
                  'rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground nm-raised-xs transition-shadow duration-200 hover:text-foreground',
                  player.streamIndex === i && 'nm-inset-sm text-primary hover:text-primary',
                )
              "
              @click="player.streamIndex = i"
            >
              Stream {{ i + 1 }}<template v-if="s.quality"> · {{ s.quality }}</template>
              <template v-if="s.labels.length"> · {{ s.labels.join(', ') }}</template>
            </button>
          </div>
        </section>
      </div>
    </template>

    <div v-else-if="notFound" class="flex flex-col items-center gap-3 py-24 text-center">
      <SearchX class="size-8 text-muted-foreground" />
      <p class="text-sm text-muted-foreground">
        This channel is unavailable or has no working streams listed.
      </p>
      <Button variant="outline" size="sm" @click="router.push('/')">Back home</Button>
    </div>

    <div v-else class="space-y-3" aria-busy="true">
      <Skeleton class="aspect-video w-full rounded-2xl" />
      <Skeleton class="h-[4.5rem] w-full rounded-2xl" />
    </div>
  </div>
</template>
