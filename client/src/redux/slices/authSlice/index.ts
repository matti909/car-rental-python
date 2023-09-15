import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { RejectedActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers'
import type { User } from '../../../app/interfaces/api.interface'
import { authThunk } from '../../thunk/auth.thunk'

export interface AuthState {
  isAuth: boolean
  success: boolean
  error: RejectedActionFromAsyncThunk<any> | null
  isExpired: boolean | null
  loading: boolean
  userData: User | null
  accessToken: string | null
}

const initialState: AuthState = {
  isAuth: false,
  accessToken: null,
  error: null,
  isExpired: false,
  loading: false,
  success: false,
  userData: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: state => {
      state.isAuth = true
    },
    logout: state => {
      state.isAuth = false
      state.accessToken = null
      state.error = null
      state.isExpired = true
      state.loading = false
      state.success = false
      state.userData = null
    },
  },
  extraReducers: builder => {
    builder.addCase(authThunk.pending, state => {
      return (state = {
        ...initialState,
        loading: true,
      })
    })
    builder.addCase(authThunk.fulfilled, (state, action) => {
      return (state = {
        ...initialState,
        loading: false,
        success: true,
        accessToken: action.payload.accessToken,
        isAuth: true,
        userData: action.payload.user,
      })
    })
    builder.addCase(authThunk.rejected, (state, action: PayloadAction<any>) => {
      return (state = {
        ...initialState,
        error: action.payload.message,
      })
    })
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
