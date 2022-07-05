import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  subDomainEditMode: false,
  isShowDrawer: false
}

export const uiSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    toggleSubDomainEditMode: (state, { payload }) => {
      state.subDomainEditMode = payload
    },
    toggleDrawer: (state, { payload }) => {
      console.log(payload)
      state.isShowDrawer = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { toggleSubDomainEditMode, toggleDrawer } = uiSlice.actions

export default uiSlice.reducer
