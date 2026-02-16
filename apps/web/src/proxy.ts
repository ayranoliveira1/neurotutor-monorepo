import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register']
const protectedRoutes = [
  '/dashboard',

  '/fluxo-de-caixa',
  '/notas-fiscais',
  '/debitos',
  '/custos-fixos',
  '/receitas',
  '/precificacao',
  '/insumos',
  '/embalagens',
  '/fornecedores',
  '/estoque',
  '/producao',
  '/clientes',
  '/agenda',
  '/configuracao',
]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const sessionCookie = req.cookies.get('session_token')

  if (
    protectedRoutes.some((route) => path.startsWith(route)) &&
    !sessionCookie
  ) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (publicRoutes.includes(path) && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
