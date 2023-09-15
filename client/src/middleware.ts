import { decodeJwt } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth'

const isUserRoute = (pathname: string) => {
  return pathname.startsWith('/dashboard')
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('user-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/account/login', req.url))
  }
  const role = decodeJwt(token).sub
  const verifyToken =
    token &&
    (await verifyAuth(token).catch(err => {
      console.log(err)
    }))

  if (!verifyToken || !token) {
    return NextResponse.redirect(new URL('/account/login', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/account/login') && !verifyToken) {
    return
  }

  if (req.url.includes('/account/login') && verifyToken) {
    return NextResponse.redirect(new URL('/cars', req.url))
  }

  // Verifica si el role es "ADMIN" para acceder a /dashboard
  if (isUserRoute(req.nextUrl.pathname) && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Proteger /cars para usuarios con token válido
  if (req.nextUrl.pathname.startsWith('/cars') && !verifyToken) {
    return NextResponse.redirect(new URL('/account/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard', '/cars', '/'], // Agrega '/cars' a las rutas protegidas
}
