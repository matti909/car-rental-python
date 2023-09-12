import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  accesToken: string | null
}

const initialState: AuthState = {
  accesToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accesToken = action.payload
    },
  },
})

export default authSlice.reducer
