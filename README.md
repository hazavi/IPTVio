# IPTVio

A minimal IPTV web player built with Vue 3. Pick a country, browse its channels, and watch live streams in the browser. Channel data comes from the public [iptv-org API](https://iptv-org.github.io/).

## Setup

```bash
npm i
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint     # ESLint
npm run format   # Prettier
```

## Stack

Vue 3 (`<script setup>`), Vite, TypeScript, Pinia, Vue Router, Tailwind CSS v4, Reka UI primitives (the base of shadcn-vue), lucide-vue-next, hls.js, VueUse.

The UI follows the visual patterns of [21st.dev](https://21st.dev/) (command palette, cards, badges, skeletons), re-implemented in Vue because 21st.dev components are React.

## Features

- Searchable country combobox with flags and channel counts (last choice is remembered)
- Virtualized channel list with search, category filter, and favorites
- hls.js player: play/pause, volume, fullscreen, picture-in-picture, quality selector, auto-retry, fallback to alternative streams
- Shortcuts: `Space` play/pause, `F` fullscreen, `M` mute, `↑`/`↓` previous/next channel
- Light/dark theme (follows system by default), recently watched, shareable URLs: `/watch/:countryCode/:channelId`

## Notes

- All streams are public third-party links. This app does not host, store, or control any content, and availability is not guaranteed.
- The catalog (countries, channels, streams, logos) is fetched client-side and cached in IndexedDB for 24 hours.
- Some streams fail because of CORS, geo-blocking, dead links, or plain `http://` URLs on an `https://` page. The player shows an error and offers alternative streams when available. Headers such as `Referer` and `User-Agent` listed in the API cannot be set from a browser.

### Optional CORS proxy

There is no backend by default. If a stream is blocked by CORS you can run a small proxy yourself (for example a Cloudflare Worker or a Node server that forwards the request and adds `Access-Control-Allow-Origin`), then prefix stream URLs with it in `src/api/iptv.ts`. Only proxy streams you are allowed to access.
