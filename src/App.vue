<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { List } from 'lucide-vue-next'
import { useCatalogStore } from '@/stores/catalog'
import { useTheme } from '@/composables/useTheme'
import ChannelList from '@/components/ChannelList.vue'
import CountryCombobox from '@/components/CountryCombobox.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Button from '@/components/ui/Button.vue'
import Sheet from '@/components/ui/Sheet.vue'

const catalog = useCatalogStore()
const { isDark } = useTheme()
const sheetOpen = ref(false)

watchEffect(() => document.documentElement.classList.toggle('dark', isDark.value))
onMounted(() => catalog.load())
</script>

<template>
  <div class="flex h-dvh flex-col">
    <header class="flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6">
      <RouterLink to="/" class="flex items-center gap-2.5 rounded-lg" aria-label="IPTVio home">
        <img src="/logo.png" alt="" class="size-8" />
        <span class="text-base font-semibold tracking-tight">IPTVio</span>
      </RouterLink>
      <div class="flex items-center gap-1">
        <a
          href="https://github.com/hazavi/IPTVio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          class="inline-flex size-9 items-center justify-center rounded-xl transition-colors duration-150 hover:bg-accent"
        >
          <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
            <path
              d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
            />
          </svg>
        </a>
        <ThemeToggle />
      </div>
    </header>

    <div class="grid min-h-0 flex-1 md:grid-cols-[21rem_1fr]">
      <aside class="hidden min-h-0 flex-col gap-4 border-r p-4 md:flex" aria-label="Channels">
        <CountryCombobox />
        <ChannelList class="min-h-0 flex-1" />
      </aside>

      <main class="min-h-0 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
        <RouterView />
      </main>
    </div>

    <div
      class="fixed inset-x-0 bottom-0 z-30 border-t bg-background/80 p-3 backdrop-blur md:hidden"
    >
      <Button class="w-full" @click="sheetOpen = true"><List /> Browse channels</Button>
    </div>

    <Sheet v-model:open="sheetOpen" title="Channels" description="Choose a country and a channel">
      <div class="flex h-full min-h-0 flex-col gap-3 px-3 pb-3">
        <CountryCombobox />
        <ChannelList class="min-h-0 flex-1" @select="sheetOpen = false" />
      </div>
    </Sheet>
  </div>
</template>
