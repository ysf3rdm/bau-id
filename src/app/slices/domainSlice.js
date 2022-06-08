import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedDomain: null,
  searchingDomainName: ''
}

export const domainSlice = createSlice({
  name: 'domainDetail',
  initialState,
  reducers: {
    setSelectedDomain: (state, { payload }) => {
      state.selectedDomain = payload
    },
    setSearchDomainName: (state, { payload }) => {
      state.searchingDomainName = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setSelectedDomain, setSearchDomainName } = domainSlice.actions

export default domainSlice.reducer
