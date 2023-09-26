import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { UserData } from '../../app/interfaces/api.interface'
import type { RootState } from '../store'

const api = createApi({
  reducerPath: 'userApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),

  endpoints: builder => ({
    getuser: builder.query<UserData, null>({
      query: () => 'users/me',
    }),
  }),
})

export const { useGetuserQuery } = api

export default api
