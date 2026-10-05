const DB_NAME = 'iptvio'
const STORE = 'cache'

interface Entry<T> {
  savedAt: number
  value: T
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function cacheGet<T>(key: string, ttlMs: number): Promise<T | null> {
  try {
    const db = await openDb()
    return await new Promise<T | null>((resolve, reject) => {
      const req = db.transaction(STORE).objectStore(STORE).get(key)
      req.onsuccess = () => {
        const entry = req.result as Entry<T> | undefined
        resolve(entry && Date.now() - entry.savedAt < ttlMs ? entry.value : null)
      }
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

export async function cacheSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ savedAt: Date.now(), value } satisfies Entry<T>, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // Cache is best-effort; the app works without it.
  }
}
