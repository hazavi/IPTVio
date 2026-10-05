import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useCatalogStore } from './catalog'

export const useCountriesStore = defineStore('countries', () => {
  const catalog = useCatalogStore()
  const selectedCode = useLocalStorage<string>('iptvio:country', '')

  const countries = computed(() => catalog.countries)
  const selected = computed(
    () => countries.value.find((c) => c.code === selectedCode.value) ?? null,
  )

  function select(code: string) {
    selectedCode.value = code
  }

  return { countries, selectedCode, selected, select }
})
