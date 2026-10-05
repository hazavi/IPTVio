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

  const availableCategories = computed(() => {
    const ids = new Set(inCountry.value.flatMap((c) => c.categories))
    return catalog.categories.filter((c) => ids.has(c.id))
  })

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return inCountry.value.filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q)) &&
        (!category.value || c.categories.includes(category.value)) &&
        (!favoritesOnly.value || favorites.has(c.id)),
    )
  })

  function resetFilters() {
    search.value = ''
    category.value = null
    favoritesOnly.value = false
  }

  return { search, category, favoritesOnly, inCountry, availableCategories, filtered, resetFilters }
})
