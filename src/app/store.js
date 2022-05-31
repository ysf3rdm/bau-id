import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/accountSlice'
import errorSlice from './slices/errorSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    error: errorSlice,
    ui: uiSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
})
