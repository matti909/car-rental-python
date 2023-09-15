'use client'

import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useFormContext } from '../../hooks/useForm'
import { useAppDispatch } from '../../../redux/hook'
import { authThunk } from '../../../redux/thunk/auth.thunk'

const Login = () => {
  const { actions } = useFormContext()
  const { register, getValues } = actions
  const [error, setError] = React.useState<string>('')
  const router = useRouter()
  // const { isAuth } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  const values = getValues()
  const { email, password } = values

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await dispatch(authThunk({ email, password }))
      router.push('/cars')
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
      {!!error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
      <div>
        <form
          className=" max-w-md flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="mt-1 block w-full"
              placeholder="your email"
              required
              {...register('email')}
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              placeholder="your password"
              required
              className="mt-1 block w-full"
              {...register('password')}
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
