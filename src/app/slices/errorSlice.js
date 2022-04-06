import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  error: ''
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    getError: (state, { payload }) => {
      console.log('payload', payload)
      state.error = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { getError } = errorSlice.actions

export default errorSlice.reducer
