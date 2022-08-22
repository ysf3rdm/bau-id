import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accounts: [],
  isReadOnly: false,
  isSafeApp: false,
  network: '',
  displayName: '',
  profileEditMode: false
}

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    getAccounts: (state, { payload }) => {
      state.accounts = payload
    },
    getHomeData: (state, { payload }) => {
      state.isReadOnly = payload.isReadOnly
      state.isSafeApp = payload.isSafeApp
      state.network = payload.network
      state.displayName = payload.displayName
    },
    toggleEditMode: (state, { payload }) => {
      state.profileEditMode = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  getAccounts,
  getHomeData,
  toggleEditMode
} = accountsSlice.actions

export default accountsSlice.reducer
