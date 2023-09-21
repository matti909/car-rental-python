import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../../../app/interfaces/api.interface'

export interface AuthState {
  isAuth: boolean
  success: boolean
  loading: boolean
  userData: User | null
  accessToken: string | null
}

const initialState: AuthState = {
  isAuth: false,
  accessToken: null,
  loading: false,
  success: false,
  userData: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuth = true
      state.accessToken = action.payload.accessToken
      state.success = true
    },
    setUser: (state, action) => {
      state.userData = action.payload.userData
    },
    logout: state => {
      state.isAuth = false
      state.accessToken = null
      state.loading = false
      state.success = false
      state.userData = null
    },
  },
})

export const { login, logout, setUser } = authSlice.actions

export default authSlice.reducer
