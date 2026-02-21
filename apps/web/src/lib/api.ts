import { cookies } from 'next/headers'

const API_URL = process.env.API_URL

interface ApiResponse<T = unknown> {
  data?: T
  error?:
    | string
    | { message?: string; path?: string[]; code?: string }[]
  message?: string
  success?: boolean
}

export function handleApiError(
  response: Response,
  data: ApiResponse,
  fallbackMessage: string,
): void {
  if (response.ok && data.success) return

  const errorMsg = Array.isArray(data.error)
    ? data.error
        .map((e) => (typeof e === 'string' ? e : e?.message))
        .filter(Boolean)
        .join(', ')
    : data.error

  throw new Error(data.message || errorMsg || fallbackMessage)
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

export async function api<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ response: Response; data: ApiResponse<T> }> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  if (!skipAuth) {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    const cookieHeader = allCookies
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    if (cookieHeader) {
      ;(headers as Record<string, string>)['Cookie'] = cookieHeader
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
    cache: 'no-store',
  })

  let data: ApiResponse<T> = {}

  try {
    data = await response.json()
  } catch {
    // Response may not be JSON
  }

  return { response, data }
}

export async function setCookiesFromResponse(response: Response) {
  const setCookieHeaders = response.headers.getSetCookie()
  if (!setCookieHeaders || setCookieHeaders.length === 0) return

  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === 'production'

  for (const setCookie of setCookieHeaders) {
    const cookieParts = setCookie.split(';')[0]
    const [name, ...valueParts] = cookieParts.split('=')
    const value = decodeURIComponent(valueParts.join('='))

    const cookieLower = setCookie.toLowerCase()
    const isHttpOnly = cookieLower.includes('httponly')
    const sameSiteMatch = setCookie.match(/samesite=(\w+)/i)
    const sameSite = sameSiteMatch
      ? (sameSiteMatch[1].toLowerCase() as 'lax' | 'strict' | 'none')
      : 'lax'
    const maxAgeMatch = setCookie.match(/max-age=(\d+)/i)
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : undefined

    cookieStore.set(name, value, {
      httpOnly: isHttpOnly,
      secure: isProduction,
      sameSite: isProduction ? sameSite : 'lax',
      path: '/',
      maxAge,
    })
  }
}
