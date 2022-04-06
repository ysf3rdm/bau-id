import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/accountSlice'
import errorSlice from './slices/errorSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    error: errorSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
})
