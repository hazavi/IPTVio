export interface ApiCountry {
  name: string
  code: string
  languages: string[]
  flag: string
}

export interface ApiChannel {
  id: string
  name: string
  alt_names: string[]
  network: string | null
  owners: string[]
  country: string
  categories: string[]
  is_nsfw: boolean
  launched: string | null
  closed: string | null
  replaced_by: string | null
  website: string | null
}

export interface ApiStream {
  channel: string | null
  feed: string | null
  title: string
  url: string
  referrer: string | null
  user_agent: string | null
  quality: string | null
  labels?: string[]
}

export interface ApiLogo {
  channel: string
  feed: string | null
  in_use?: boolean
  tags: string[]
  width: number
  height: number
  format: string | null
  url: string
}

export interface ApiCategory {
  id: string
  name: string
  description?: string
}

export interface StreamSource {
  url: string
  title: string
  quality: string | null
  labels: string[]
}

export interface Channel {
  id: string
  name: string
  country: string
  categories: string[]
  logo: string | null
  website: string | null
  streams: StreamSource[]
}

export interface Country {
  code: string
  name: string
  flag: string
  channelCount: number
}

export interface Category {
  id: string
  name: string
}

export interface Catalog {
  countries: Country[]
  categories: Category[]
  channels: Channel[]
}
