import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userApi from './services/userApi'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import carsApi from './services/carsApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [carsApi.reducerPath]: carsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(userApi.middleware, carsApi.middleware),
  devTools: true,
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type Dispatch = typeof store.dispatch
