import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  login: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ login: 'Jhon Doe' })
}
