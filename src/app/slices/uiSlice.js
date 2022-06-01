import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  subDomainEditMode: false
}

export const uiSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    toggleSubDomainEditMode: (state, { payload }) => {
      state.subDomainEditMode = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { toggleSubDomainEditMode } = uiSlice.actions

export default uiSlice.reducer
