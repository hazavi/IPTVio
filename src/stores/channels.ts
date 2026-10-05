import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useCatalogStore } from './catalog'
import { useCountriesStore } from './countries'
import { useFavoritesStore } from './favorites'

export const useChannelsStore = defineStore('channels', () => {
  const catalog = useCatalogStore()
  const countries = useCountriesStore()
  const favorites = useFavoritesStore()

  const search = ref('')
  const category = ref<string | null>(null)
  const favoritesOnly = ref(false)

  const inCountry = computed(() =>
    catalog.channels.filter((c) => c.country === countries.selectedCode),
  )

  // Favorites mode spans every country.
  const pool = computed(() =>
    favoritesOnly.value ? catalog.channels.filter((c) => favorites.has(c.id)) : inCountry.value,
  )

  const availableCategories = computed(() => {
    const ids = new Set(pool.value.flatMap((c) => c.categories))
    return catalog.categories.filter((c) => ids.has(c.id))
  })

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return pool.value.filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q)) &&
        (!category.value || c.categories.includes(category.value)),
    )
  })

  function resetFilters() {
    search.value = ''
    category.value = null
  }

  return { search, category, favoritesOnly, inCountry, availableCategories, filtered, resetFilters }
})
