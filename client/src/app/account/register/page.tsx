'use client'

import React from 'react'

import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'

const register = () => {
  const [error, setError] = React.useState('')
  const router = useRouter()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const res = await axios.post('/api/register', {
        email: formData.get('email'),
        password: formData.get('password'),
        username: formData.get('username'),
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
    <div className="flex flex-col items-center justify-center">
      {error !== null && (
        <div className="bg-red-500 text-white p-2 mb-2">{error}</div>
      )}
      <h1>Register </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="e-mail"
          name="email"
          className="bg-zinc-600 px-4 py-4 block mb-2"
        />
        <input
          type="text"
          placeholder="username"
          name="username"
          className="bg-zinc-600 px-4 py-4 block mb-2"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          className="bg-zinc-600 px-4 py-4 block mb-2"
        />

        <button className="bg-blue-500 text-white px-4 py-2 block w-full mt-4">
          Signup
        </button>
      </form>
    </div>
  )
}

export default register
