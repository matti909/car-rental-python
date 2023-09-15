import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Cars } from '../../app/interfaces/car.interface'

const api = createApi({
  reducerPath: 'carsApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/',
  }),
  endpoints: builder => ({
    getCars: builder.query<Cars[], null>({
      query: () => 'cars',
    }),
  }),
})

export const { useGetCarsQuery } = api

export default api
