import { NextResponse, type NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('user-token')?.value

  const verifyToken =
    token &&
    (await verifyAuth(token).catch(err => {
      console.log(err)
    }))

  console.log(verifyToken)

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
