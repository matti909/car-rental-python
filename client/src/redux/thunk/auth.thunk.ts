import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { RestAPIResponse } from '../../app/interfaces/api.interface'

// Crear una función asincrónica para realizar la solicitud
export const authThunk = createAsyncThunk(
  'users/me',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post('/api/login', {
        email,
        password,
      })
      const data = res.data as RestAPIResponse
      const { token: accessToken, user } = data
      return {
        accessToken,
        user,
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
