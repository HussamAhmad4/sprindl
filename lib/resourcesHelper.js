import { resources } from '../src/data/resources.js'
export function lookupResources(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return []
  const byId = new Map(resources.map((r) => [r.id, r]))
  return ids.map((id) => byId.get(id)).filter(Boolean)
}
