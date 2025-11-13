import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import forgotPasswordSlice from './slice/forgotPasswordSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    forgot :forgotPasswordSlice.reducer
  },
})