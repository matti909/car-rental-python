import type { NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'

export default async function (req: NextRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const jwt = req.headers.get('Authorization')

    if (!jwt) {
      res.status(401).end()
      return
    }

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      const userData = await result.json()
      userData.jwt = jwt
      res.status(200).json(userData)
    } catch (error) {
      res.status(401).end()
      return
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}
