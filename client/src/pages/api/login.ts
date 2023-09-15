import cookie from 'cookie'
import type { NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { getJwtSecretKey } from '../../lib/auth'
import { nanoid } from '@reduxjs/toolkit'

export default async (req: NextRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // Extrae el email y la contraseña del cuerpo de la solicitud
      const { email, password } = req.body as unknown as {
        email: string
        password: string
      }

      // Realiza una solicitud a la API de autenticación
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      )

      // Analiza la respuesta JSON de la API
      const data = await result.json()

      if (result.ok) {
        const jwt = await new SignJWT({})
          .setProtectedHeader({ alg: 'HS256' })
          .setJti(nanoid())
          .setIssuedAt()
          .setExpirationTime('10000m')
          .setSubject(data.user.role)
          .sign(new TextEncoder().encode(getJwtSecretKey()))

        // Configura una cookie con el token JWT
        res
          .status(200)
          .setHeader(
            'Set-Cookie',
            cookie.serialize('user-token', jwt, {
              path: '/',
              httpOnly: true,
              sameSite: 'strict',
            })
          )
          .json(data)
      } else {
        // En caso de error en la respuesta de la API
        data.error = data.detail
        res.status(401).json(data)
      }
    } catch (error) {
      // Maneja errores de conexión o excepciones inesperadas
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    // Responde con un error si el método de solicitud no es POST
    res.setHeader('Allow', ['POST'])
    res.status(405).json({
      message: `Method ${req.method} not allowed`,
    })
  }
}
