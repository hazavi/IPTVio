import { computed } from 'vue'
import { useLocalStorage, usePreferredDark } from '@vueuse/core'

export type ThemeMode = 'light' | 'dark' | 'system'

const mode = useLocalStorage<ThemeMode>('iptvio:theme', 'system')
const prefersDark = usePreferredDark()
const isDark = computed(
  () => mode.value === 'dark' || (mode.value === 'system' && prefersDark.value),
)

export function useTheme() {
  return { mode, isDark }
}
