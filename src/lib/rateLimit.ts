// In-memory limiter: fine for one server instance. Use Redis/Upstash if you run several.
const hits = new Map<string, number[]>();
export function limited(key: string, max: number, windowMs: number, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  recent.push(now); hits.set(key, recent);
  return recent.length > max;
}
