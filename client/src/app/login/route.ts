import cookie from 'cookie'
import { type NextApiResponse } from 'next'

import type { NextRequest } from 'next/server'

export default async (req: NextRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body as unknown as {
      email: string
      password: string
    }
    const result = await fetch('http://127.0.0.1:8000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await result.json()
    if (result.ok) {
      const jwt = data.token
      res
        .status(200)
        .setHeader(
          'Set-Cookie',
          cookie.serialize('jwt', jwt, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30
          })
        )
        .json({
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          jwt
        })
    } else {
      data.error = data.detail
      res.status(401)
      res.json(data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({
      message: `Method ${req.method} not allowed`
    })
  }
}
