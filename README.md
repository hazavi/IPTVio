<div align="center">

<img src="public/logo.png" alt="IPTVio logo" width="96" height="96" />

# IPTVio

A soft, tactile web player for live TV. Pick a country, tap a channel, and watch free public streams from around the world, right in your browser.

[Open IPTVio](https://hazavi.github.io/IPTVio/)

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

- **Country picker**: searchable, with flag images and channel counts. Your last choice is remembered.
- **Channel browser**: fast search, category filters with arrow scrolling, and a virtualized list that stays smooth with thousands of channels.
- **Favorites from all countries**: star channels anywhere, then switch on the star filter to see every favorite in one list, each marked with its country flag.
- **Live player**: quality selector, volume, fullscreen, picture-in-picture, and automatic retry. If a stream fails, it can switch to an alternative.
- **Recently watched** and **shareable links**: every channel has its own URL, `/watch/:countryCode/:channelId`.
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

## Deployment

Pushes to `main` deploy the production build to GitHub Pages through `.github/workflows/pages.yml`. In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. The app is served from `/IPTVio/`; shared channel links also load through the included `404.html` fallback.

## Tech stack

- [Vue 3](https://vuejs.org/), [Vite](https://vite.dev/), TypeScript
- [Pinia](https://pinia.vuejs.org/) and [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4 with [Reka UI](https://reka-ui.com/) primitives
- [Lucide](https://lucide.dev/) icons and [flagcdn](https://flagcdn.com/) country flags
- [hls.js](https://github.com/video-dev/hls.js) for playback and [VueUse](https://vueuse.org/) for utilities

The design takes cues from [21st.dev](https://21st.dev/), re-implemented in Vue since 21st.dev components are React.

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

## Roadmap

Features and improvements, maybe :

**Features**

- Live TV guide (EPG) using the iptv-org guides data, with a "now playing" line per channel
- Search across all countries, plus filters by language and by stream quality
- Custom playlists and favorite folders, with import and export of favorites as JSON or M3U
- Multi-view mode to watch two or more channels side by side
- Automatically hide streams that failed recently, with a "report broken stream" shortcut
- Installable PWA with offline shell and a remembered last-watched channel
- Desktop app (Electron)


**Engineering**

- Code-split `hls.js` with a dynamic import to shrink the first load
- Add unit tests for the catalog join and stores (Vitest) and end-to-end tests (Playwright)
- Host the flag images locally instead of loading them from a CDN, and add a CI workflow for lint and build
- Optional proxy or edge function to work around CORS and mixed-content streams
