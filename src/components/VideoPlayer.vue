<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { onClickOutside, useFullscreen, useIdle, useMediaControls } from '@vueuse/core'
import {
  AlertTriangle,
  Check,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCw,
  Settings2,
  Volume2,
  VolumeX,
} from 'lucide-vue-next'
import { useHls } from '@/composables/useHls'
import { useShortcuts } from '@/composables/useShortcuts'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{ src: string | null; hasAlternative: boolean }>()
const emit = defineEmits<{ tryAnother: []; prevChannel: []; nextChannel: [] }>()

const container = useTemplateRef<HTMLElement>('container')
const video = useTemplateRef<HTMLVideoElement>('video')
const src = computed(() => props.src)

const { status, error, levels, level, setLevel, reload } = useHls(video, src)
const { playing, muted, volume } = useMediaControls(video)
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(container)
const { idle } = useIdle(3000)

const pipSupported = typeof document !== 'undefined' && document.pictureInPictureEnabled
const menuOpen = ref(false)
const menu = useTemplateRef<HTMLElement>('menu')
onClickOutside(menu, () => (menuOpen.value = false))

const controlsVisible = computed(
  () => status.value === 'error' || !playing.value || !idle.value || menuOpen.value,
)

function togglePlay() {
  playing.value = !playing.value
}
function toggleMute() {
  muted.value = !muted.value
}
async function togglePip() {
  const el = video.value
  if (!el) return
  if (document.pictureInPictureElement) await document.exitPictureInPicture()
  else await el.requestPictureInPicture().catch(() => {})
}
function pickLevel(index: number) {
  setLevel(index)
  menuOpen.value = false
}

useShortcuts({
  togglePlay,
  toggleFullscreen: () => void toggleFullscreen(),
  toggleMute,
  nextChannel: () => emit('nextChannel'),
  prevChannel: () => emit('prevChannel'),
})
</script>

<template>
  <div class="rounded-[1.75rem] bg-background p-2.5 nm-raised">
    <div class="rounded-[1.25rem] p-1.5 nm-inset">
      <div
        ref="container"
        class="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black"
        :class="{ 'cursor-none': !controlsVisible }"
      >
        <video
          ref="video"
          class="size-full bg-black"
          playsinline
          aria-label="Live stream"
          @click="togglePlay"
          @dblclick="toggleFullscreen()"
        />

        <div
          v-if="status === 'loading'"
          class="pointer-events-none absolute inset-0 grid place-items-center"
          role="status"
          aria-label="Loading stream"
        >
          <Loader2 class="size-8 animate-spin text-white/80" />
        </div>

        <div
          v-if="status === 'error'"
          class="anim-fade absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/90 p-6 text-center text-white"
          role="alert"
        >
          <AlertTriangle class="size-8 text-amber-400" />
          <p class="max-w-sm text-sm text-zinc-300">{{ error }}</p>
          <div class="flex flex-wrap justify-center gap-2">
            <Button v-if="hasAlternative" size="sm" @click="emit('tryAnother')"
              >Try another stream</Button
            >
            <Button variant="overlay" size="sm" class="border border-white/20" @click="reload">
              <RotateCw /> Retry
            </Button>
          </div>
        </div>

        <div
          v-if="status !== 'error'"
          class="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-2 text-white transition-opacity duration-200"
          :class="controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'"
        >
          <Button
            variant="overlay"
            size="icon-sm"
            :aria-label="playing ? 'Pause' : 'Play'"
            @click="togglePlay"
          >
            <Pause v-if="playing" />
            <Play v-else />
          </Button>

          <Button
            variant="overlay"
            size="icon-sm"
            :aria-label="muted ? 'Unmute' : 'Mute'"
            @click="toggleMute"
          >
            <VolumeX v-if="muted || volume === 0" />
            <Volume2 v-else />
          </Button>
          <input
            v-model.number="volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            aria-label="Volume"
            class="hidden h-1 w-20 accent-white sm:block"
            @input="muted = false"
          />

          <span class="ml-2 inline-flex items-center gap-1.5 text-xs font-medium">
            <span class="size-1.5 rounded-full bg-red-500" aria-hidden="true" /> LIVE
          </span>

          <div class="flex-1" />

          <div v-if="levels.length > 1" ref="menu" class="relative">
            <Button
              variant="overlay"
              size="icon-sm"
              aria-label="Quality"
              :aria-expanded="menuOpen"
              @click="menuOpen = !menuOpen"
            >
              <Settings2 />
            </Button>
            <ul
              v-if="menuOpen"
              class="anim-pop absolute right-0 bottom-full mb-2 min-w-28 rounded-xl border border-white/10 bg-zinc-900 p-1 text-sm shadow-lg"
              role="menu"
            >
              <li
                v-for="opt in [{ index: -1, label: 'Auto' }, ...levels]"
                :key="opt.index"
                role="none"
              >
                <button
                  type="button"
                  role="menuitemradio"
                  :aria-checked="level === opt.index"
                  class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 hover:bg-white/10"
                  @click="pickLevel(opt.index)"
                >
                  {{ opt.label }}
                  <Check v-if="level === opt.index" class="size-3.5" />
                </button>
              </li>
            </ul>
          </div>

          <Button
            v-if="pipSupported"
            variant="overlay"
            size="icon-sm"
            aria-label="Picture in picture"
            @click="togglePip"
          >
            <PictureInPicture2 />
          </Button>
          <Button
            variant="overlay"
            size="icon-sm"
            :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
            @click="toggleFullscreen()"
          >
            <Minimize v-if="isFullscreen" />
            <Maximize v-else />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
