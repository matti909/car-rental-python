import { createSlice } from '@reduxjs/toolkit'
import type { RejectedActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers'
import type { User } from '../../../app/interfaces/api.interface'
import { authThunk } from '../../thunk/auth.thunk'

export interface AuthState {
  isAuth: boolean
  success: boolean
  error: RejectedActionFromAsyncThunk<any> | null
  loading: boolean
  userData: User | null
  accessToken: string | null
}

const initialState: AuthState = {
  isAuth: false,
  accessToken: null,
  error: null,
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
    logOut: state => {
      state.isAuth = false
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
    builder.addCase(authThunk.rejected, (state, action) => {
      return (state = {
        ...initialState,
        error: action.payload,
      })
    })
  },
})

export const { login } = authSlice.actions

export default authSlice.reducer
