import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useCatalogStore } from './catalog'
import type { Channel } from '@/types/iptv'

const MAX_RECENT = 12

export const usePlayerStore = defineStore('player', () => {
  const catalog = useCatalogStore()

  const current = ref<Channel | null>(null)
  const streamIndex = ref(0)
  const recentIds = useLocalStorage<string[]>('iptvio:recent', [])

  const currentStream = computed(() => current.value?.streams[streamIndex.value] ?? null)
  const hasAlternative = computed(
    () => !!current.value && streamIndex.value < current.value.streams.length - 1,
  )
  const recent = computed(() =>
    recentIds.value.map((id) => catalog.getChannel(id)).filter((c): c is Channel => !!c),
  )

  function play(channel: Channel) {
    current.value = channel
    streamIndex.value = 0
    recentIds.value = [channel.id, ...recentIds.value.filter((id) => id !== channel.id)].slice(
      0,
      MAX_RECENT,
    )
  }

  function nextStream(): boolean {
    if (!hasAlternative.value) return false
    streamIndex.value++
    return true
  }

  function retryFromStart() {
    streamIndex.value = 0
  }

  return {
    current,
    streamIndex,
    currentStream,
    hasAlternative,
    recent,
    play,
    nextStream,
    retryFromStart,
  }
})
