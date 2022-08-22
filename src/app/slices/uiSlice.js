import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  subDomainEditMode: false,
  isShowDrawer: false,
  isShowNetworkErrorModal: false
}

export const uiSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    toggleSubDomainEditMode: (state, { payload }) => {
      state.subDomainEditMode = payload
    },
    toggleDrawer: (state, { payload }) => {
      state.isShowDrawer = payload
    },
    toggleNetworkError: (state, { payload }) => {
      state.isShowNetworkErrorModal = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  toggleSubDomainEditMode,
  toggleDrawer,
  toggleNetworkError
} = uiSlice.actions

export default uiSlice.reducer
