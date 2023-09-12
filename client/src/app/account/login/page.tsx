'use client'

import axios, { AxiosError } from 'axios'
import React from 'react'
import { useRouter } from 'next/navigation'
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

const Login = () => {
  const router = useRouter()
  const [sigin, setSigin] = React.useState({
    email: '',
    password: '',
  })
  const [error, setError] = React.useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setSigin(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await axios.post('/api/login', {
        email: sigin.email,
        password: sigin.password,
      })
      if (res.status === 200) router.push('/cars')
      console.log(res)
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data
        setError(errorMessage)
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h2 className=" text-orange-500 font-bold text-lg">Login</h2>
      {error !== null && (
        <div className="bg-red-500 text-white p-2 mb-2">{error}</div>
      )}
      <div>
        <form
          className=" max-w-md flex flex-col justify-center items-center"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              className="mt-1 block w-full"
              placeholder="your email"
              required
              value={sigin.email}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              placeholder="your password"
              required
              className="mt-1 block w-full"
              value={sigin.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="py-4 px-4 :hover bg-gray-200">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
