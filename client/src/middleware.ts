import { NextResponse, type NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth'
import { includes } from 'lodash'

const isUserRoute = (pathname: string) => {
  return pathname.startsWith('/dashboard')
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('user-token')?.value
  const role = req.headers.get('authorization')
  const { pathname } = req.nextUrl
  console.log(role)

  const verifyToken =
    token &&
    (await verifyAuth(token).catch(err => {
      console.log(err)
    }))

  if (isUserRoute(pathname) && includes(['user', 'ADMIN'], role)) {
    return NextResponse.redirect(new URL('/account/login', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/account/login') && !verifyToken) {
    return
  }

  if (req.url.includes('/account/login') && verifyToken) {
    return NextResponse.redirect(new URL('/cars', req.url))
  }

  if (!verifyToken) {
    return NextResponse.redirect(new URL('/account/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard'],
}
