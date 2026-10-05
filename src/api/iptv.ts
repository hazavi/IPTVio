import { cacheGet, cacheSet } from './cache'
import type {
  ApiCategory,
  ApiChannel,
  ApiCountry,
  ApiLogo,
  ApiStream,
  Catalog,
  Channel,
  StreamSource,
} from '@/types/iptv'

const BASE = 'https://iptv-org.github.io/api'
const CACHE_KEY = 'catalog-v1'
const TTL_MS = 24 * 60 * 60 * 1000

async function getJson<T>(file: string): Promise<T> {
  const res = await fetch(`${BASE}/${file}.json`)
  if (!res.ok) throw new Error(`Failed to load ${file} (${res.status})`)
  return (await res.json()) as T
}

function qualityRank(q: string | null): number {
  const n = q ? parseInt(q, 10) : 0
  return Number.isFinite(n) ? n : 0
}

function bestLogos(logos: ApiLogo[]): Map<string, string> {
  const score = (l: ApiLogo) =>
    (l.in_use === false ? 0 : 4) +
    (l.feed === null ? 2 : 0) +
    (l.format === 'PNG' || l.format === 'SVG' ? 1 : 0)
  const best = new Map<string, ApiLogo>()
  for (const l of logos) {
    const cur = best.get(l.channel)
    if (!cur || score(l) > score(cur)) best.set(l.channel, l)
  }
  return new Map([...best].map(([id, l]) => [id, l.url]))
}

function groupStreams(streams: ApiStream[]): Map<string, StreamSource[]> {
  const map = new Map<string, StreamSource[]>()
  for (const s of streams) {
    if (!s.channel || !s.url) continue
    const list = map.get(s.channel) ?? []
    if (list.some((x) => x.url === s.url)) continue
    list.push({ url: s.url, title: s.title, quality: s.quality, labels: s.labels ?? [] })
    map.set(s.channel, list)
  }
  for (const list of map.values()) {
    list.sort((a, b) => {
      const https = Number(b.url.startsWith('https')) - Number(a.url.startsWith('https'))
      return https || qualityRank(b.quality) - qualityRank(a.quality)
    })
  }
  return map
}

export function buildCatalog(
  countries: ApiCountry[],
  channels: ApiChannel[],
  streams: ApiStream[],
  logos: ApiLogo[],
  categories: ApiCategory[],
): Catalog {
  const streamMap = groupStreams(streams)
  const logoMap = bestLogos(logos)

  const joined: Channel[] = []
  for (const c of channels) {
    if (c.is_nsfw || c.closed) continue
    const sources = streamMap.get(c.id)
    if (!sources?.length) continue
    joined.push({
      id: c.id,
      name: c.name,
      country: c.country,
      categories: c.categories,
      logo: logoMap.get(c.id) ?? null,
      website: c.website,
      streams: sources,
    })
  }
  joined.sort((a, b) => a.name.localeCompare(b.name))

  const counts = new Map<string, number>()
  for (const c of joined) counts.set(c.country, (counts.get(c.country) ?? 0) + 1)

  return {
    channels: joined,
    countries: countries
      .filter((c) => counts.has(c.code))
      .map((c) => ({ code: c.code, name: c.name, flag: c.flag, channelCount: counts.get(c.code)! }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
  }
}

export async function loadCatalog(): Promise<Catalog> {
  const cached = await cacheGet<Catalog>(CACHE_KEY, TTL_MS)
  if (cached) return cached

  const [countries, channels, streams, logos, categories] = await Promise.all([
    getJson<ApiCountry[]>('countries'),
    getJson<ApiChannel[]>('channels'),
    getJson<ApiStream[]>('streams'),
    getJson<ApiLogo[]>('logos'),
    getJson<ApiCategory[]>('categories'),
  ])
  const catalog = buildCatalog(countries, channels, streams, logos, categories)
  void cacheSet(CACHE_KEY, catalog)
  return catalog
}
