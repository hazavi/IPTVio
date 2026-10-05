import { onBeforeUnmount, onMounted } from 'vue'

export interface Shortcuts {
  togglePlay: () => void
  toggleFullscreen: () => void
  toggleMute: () => void
  nextChannel: () => void
  prevChannel: () => void
}

function shouldIgnore(e: KeyboardEvent): boolean {
  if (e.metaKey || e.ctrlKey || e.altKey) return true
  const t = e.target as HTMLElement | null
  if (!t) return false
  if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return true
  return !!t.closest('[role="dialog"], [role="listbox"]')
}

export function useShortcuts(handlers: Shortcuts) {
  function onKeydown(e: KeyboardEvent) {
    if (shouldIgnore(e)) return
    const onButton = (e.target as HTMLElement | null)?.closest('button, a') !== null

    switch (e.key) {
      case ' ':
        if (onButton) return
        e.preventDefault()
        handlers.togglePlay()
        break
      case 'f':
      case 'F':
        handlers.toggleFullscreen()
        break
      case 'm':
      case 'M':
        handlers.toggleMute()
        break
      case 'ArrowUp':
        e.preventDefault()
        handlers.prevChannel()
        break
      case 'ArrowDown':
        e.preventDefault()
        handlers.nextChannel()
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
