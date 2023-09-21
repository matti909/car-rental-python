'use client'

import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

const Login = () => {
  const [error, setError] = React.useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)
      const res = await axios.post('/api/login', {
        email: formData.get('email'),
        password: formData.get('password'),
      })
      console.log(res)
      router.push('/login')
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.detail
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
