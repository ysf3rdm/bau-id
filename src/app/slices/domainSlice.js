import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedDomain: null
}

export const domainSlice = createSlice({
  name: 'domainDetail',
  initialState,
  reducers: {
    setSelectedDomain: (state, { payload }) => {
      state.selectedDomain = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setSelectedDomain } = domainSlice.actions

export default domainSlice.reducer
