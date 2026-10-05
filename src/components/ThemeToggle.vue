<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { useTheme } from '@/composables/useTheme'

const { mode, isDark } = useTheme()

function toggle() {
  mode.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Sun v-if="isDark" />
    <Moon v-else />
  </Button>
</template>
