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
      <ThemeToggle />
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
