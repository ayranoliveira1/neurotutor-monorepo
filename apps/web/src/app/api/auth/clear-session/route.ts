import { NextRequest, NextResponse } from 'next/server'
import { validateClearSessionToken } from '@/lib/clear-session-token'

const SESSION_COOKIE_NAMES = ['session_token']

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token || !validateClearSessionToken(token)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  console.log('Valid clear session token received, clearing session cookies...')
  const response = NextResponse.redirect(new URL('/login', request.url))

  for (const name of SESSION_COOKIE_NAMES) {
    response.cookies.set(name, '', { path: '/', maxAge: 0 })
  }

  return response
}
