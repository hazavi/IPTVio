import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loadCatalog } from '@/api/iptv'
import type { Catalog, Channel } from '@/types/iptv'

export const useCatalogStore = defineStore('catalog', () => {
  const data = ref<Catalog | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const countries = computed(() => data.value?.countries ?? [])
  const categories = computed(() => data.value?.categories ?? [])
  const channels = computed(() => data.value?.channels ?? [])
  const channelsById = computed(() => new Map(channels.value.map((c) => [c.id, c])))

  async function load() {
    if (data.value || loading.value) return
    loading.value = true
    error.value = null
    try {
      data.value = await loadCatalog()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load channels'
    } finally {
      loading.value = false
    }
  }

  function getChannel(id: string): Channel | undefined {
    return channelsById.value.get(id)
  }

  return { loading, error, countries, categories, channels, load, getChannel }
})
