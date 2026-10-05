<div align="center">

<img src="public/logo.png" alt="IPTVio logo" width="96" height="96" />

# IPTVio

A modern, minimal web player for live TV. Pick a country, choose a channel, and start watching, right in your browser.

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-ffd859?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![hls.js](https://img.shields.io/badge/hls.js-HLS_playback-e8590c)](https://github.com/video-dev/hls.js)
[![Reka UI](https://img.shields.io/badge/Reka_UI-42b883)](https://reka-ui.com/)
[![Lucide](https://img.shields.io/badge/Lucide-icons-f56565?logo=lucide&logoColor=white)](https://lucide.dev/)
[![VueUse](https://img.shields.io/badge/VueUse-4fc08d?logo=vueuse&logoColor=white)](https://vueuse.org/)

</div>

Channel data comes from the public [iptv-org API](https://iptv-org.github.io/). No backend or account is required.

## Features

- **Country picker**: searchable, with flags and channel counts. Your last choice is remembered.
- **Channel browser**: fast search, category filters, favorites, and a recently watched list.
- **Live player**: quality selector, volume, fullscreen, picture-in-picture, and automatic retry. If a stream fails, it can switch to an alternative.
- **Shareable links**: every channel has its own URL, `/watch/:countryCode/:channelId`.
- **Light and dark themes**: follows your system by default.
- **Responsive**: sidebar on desktop, bottom sheet on mobile.

### Keyboard shortcuts

| Key       | Action                  |
| --------- | ----------------------- |
| `Space`   | Play / pause            |
| `F`       | Fullscreen              |
| `M`       | Mute                    |
| `↑` / `↓` | Previous / next channel |

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the development server        |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Lint with ESLint                    |
| `npm run format`  | Format with Prettier                |

## Tech stack

- [Vue 3](https://vuejs.org/), [Vite](https://vite.dev/), TypeScript
- [Pinia](https://pinia.vuejs.org/) and [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4 with [Reka UI](https://reka-ui.com/) primitives
- [Lucide](https://lucide.dev/) icons
- [hls.js](https://github.com/video-dev/hls.js) for playback and [VueUse](https://vueuse.org/) for utilities

## How it works

On first load, the app fetches countries, channels, streams, and logos from the iptv-org API, joins them, and filters out adult and closed channels and channels without a stream. The result is cached in IndexedDB for 24 hours.

```
src/
  api/          data fetching, caching, and joining
  stores/       Pinia stores (catalog, countries, channels, player, favorites)
  composables/  useHls, useShortcuts, useTheme
  components/   UI components (ui/ holds the base primitives)
  views/        Home and Watch pages
```

## Troubleshooting

A stream may not play because it is offline, geo-blocked, blocked by CORS, or served over plain `http://` on an `https://` page. The player shows an error and offers another stream when one is available. Headers such as `Referer` and `User-Agent` from the API cannot be set by a browser.

**Optional CORS proxy.** There is no backend by default. If you need one, run your own small proxy (for example a Cloudflare Worker) that adds `Access-Control-Allow-Origin`, and prefix stream URLs with it in `src/api/iptv.ts`. Only proxy streams you are allowed to access.

## Disclaimer

IPTVio does not host, store, or control any video content. All streams are public third-party links, and their availability is not guaranteed.
