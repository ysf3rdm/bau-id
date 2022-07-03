import React from 'react'
import { useSelector } from 'react-redux'
import Search from 'components/SearchName/Search'

const animation = {
  initial: {
    scale: 0,
    opacity: 0
  },
  animate: {
    opacity: 1,
    scale: 1
  }
}

export default () => {
  const searchingDomainName = useSelector(
    state => state.domain.searchingDomainName
  )
  return (
    // <div className="my-0 mx-auto min-w-[100%] md:min-w-[60%] mt-[calc((100vh-500px)/2)]">
    <div className="my-0 mx-auto min-w-[100%] md:min-w-[60%] min-h-[100vh] flex items-center">
      <div className="w-full">
        <div className="flex justify-center text-[50px] md:text-[72px] text-[#1EEFA4] font-bold font-urbanist tracking-widest mb-5">
          SPACE ID
        </div>
        <Search
          className="px-7 md:px-0 md:w-[600px] mx-auto"
          searchingDomainName={searchingDomainName}
        />
      </div>
    </div>
  )
}
