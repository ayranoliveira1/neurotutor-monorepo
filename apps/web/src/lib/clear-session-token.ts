import { createHmac } from 'crypto'

const SECRET = process.env.API_URL || 'clear-session-fallback'

export function generateClearSessionToken(): string {
  const minute = Math.floor(Date.now() / 60000)
  return createHmac('sha256', SECRET)
    .update(String(minute))
    .digest('hex')
    .slice(0, 16)
}

export function validateClearSessionToken(token: string): boolean {
  const now = Math.floor(Date.now() / 60000)

  for (const m of [now, now - 1]) {
    const expected = createHmac('sha256', SECRET)
      .update(String(m))
      .digest('hex')
      .slice(0, 16)

    if (token === expected) return true
  }

  return false
}
