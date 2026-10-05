import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import Hls from 'hls.js'

export type HlsStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface QualityLevel {
  index: number
  label: string
}

const MAX_RECOVERIES = 3

export function useHls(video: Ref<HTMLVideoElement | null>, url: Ref<string | null>) {
  const status = ref<HlsStatus>('idle')
  const error = ref<string | null>(null)
  const levels = ref<QualityLevel[]>([])
  const level = ref(-1)

  let hls: Hls | null = null
  let networkRetries = 0
  let mediaRetries = 0

  function destroy() {
    hls?.destroy()
    hls = null
    const el = video.value
    if (el) {
      el.removeAttribute('src')
      el.load()
    }
  }

  function fail(message: string) {
    status.value = 'error'
    error.value = message
    destroy()
  }

  function start() {
    destroy()
    levels.value = []
    level.value = -1
    error.value = null
    networkRetries = 0
    mediaRetries = 0

    const el = video.value
    const src = url.value
    if (!el || !src) {
      status.value = 'idle'
      return
    }

    status.value = 'loading'

    if (location.protocol === 'https:' && src.startsWith('http:')) {
      fail('This stream is served over insecure HTTP and is blocked by the browser.')
      return
    }

    if (Hls.isSupported()) {
      hls = new Hls({ lowLatencyMode: true, manifestLoadingMaxRetry: 1 })
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        levels.value = data.levels
          .map((l, index) => ({
            index,
            label: l.height ? `${l.height}p` : `${Math.round(l.bitrate / 1000)}k`,
          }))
          .filter((l, i, arr) => arr.findIndex((x) => x.label === l.label) === i)
        void el.play().catch(() => {})
      })
      hls.on(Hls.Events.FRAG_LOADED, () => {
        networkRetries = 0
        status.value = 'ready'
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal || !hls) return
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRetries < MAX_RECOVERIES) {
          networkRetries++
          hls.startLoad()
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRetries < MAX_RECOVERIES) {
          mediaRetries++
          hls.recoverMediaError()
        } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          fail(
            'The stream could not be reached. It may be offline, geo-blocked, or blocked by CORS.',
          )
        } else {
          fail('The stream could not be played.')
        }
      })
      hls.loadSource(src)
      hls.attachMedia(el)
    } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
      el.src = src
      void el.play().catch(() => {})
    } else {
      fail('HLS playback is not supported in this browser.')
    }
  }

  function setLevel(index: number) {
    level.value = index
    if (hls) hls.currentLevel = index
  }

  function onPlaying() {
    if (status.value === 'loading') status.value = 'ready'
  }
  function onWaiting() {
    if (status.value === 'ready') status.value = 'loading'
  }
  function onNativeError() {
    if (!hls) fail('The stream could not be played.')
  }

  watch(
    video,
    (el, old) => {
      for (const [target, add] of [
        [old, false],
        [el, true],
      ] as const) {
        if (!target) continue
        const fn = add
          ? target.addEventListener.bind(target)
          : target.removeEventListener.bind(target)
        fn('playing', onPlaying)
        fn('waiting', onWaiting)
        fn('error', onNativeError)
      }
    },
    { immediate: true },
  )

  watch([video, url], start, { immediate: true, flush: 'post' })

  onBeforeUnmount(() => {
    video.value?.removeEventListener('playing', onPlaying)
    video.value?.removeEventListener('waiting', onWaiting)
    video.value?.removeEventListener('error', onNativeError)
    hls?.destroy()
    hls = null
  })

  return { status, error, levels, level, setLevel, reload: start }
}
