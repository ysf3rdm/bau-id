import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  registering: false
}

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    startRegistering: (state, { payload }) => {
      state.registering = true
    },
    errorRegistering: (state, { payload }) => {
      state.registering = false
    },
    successRegistering: (state, { payload }) => {
      state.registering = false
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  startRegistering,
  errorRegistering,
  successRegistering
} = registerSlice.actions

export default registerSlice.reducer
