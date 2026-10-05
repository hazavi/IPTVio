import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = useLocalStorage<string[]>('iptvio:favorites', [])

  const set = computed(() => new Set(ids.value))

  function has(id: string) {
    return set.value.has(id)
  }

  function toggle(id: string) {
    ids.value = set.value.has(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id]
  }

  return { ids, has, toggle }
})
