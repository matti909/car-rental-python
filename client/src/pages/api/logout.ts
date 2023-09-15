import cookie from 'cookie'

import type { NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'

export default async (req: NextRequest, res: NextApiResponse) => {
  res.status(200).setHeader(
    'Set-Cookie',
    cookie.serialize('user-token', '', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: -1,
    })
  )
  res.json({ message: 'success' })
  res.end()
}
