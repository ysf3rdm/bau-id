import React from 'react'
import SearchDefault from 'components/SearchName/Search'

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
  return (
    <div className="my-0 mx-auto min-w-[100%] md:min-w-[60%] mt-[30vh]">
      <>
        <div className="flex justify-center text-[72px] text-[#1EEFA4] font-bold font-urbanist tracking-widest">
          SPACE ID
        </div>
        <h1
          className=""
          initial={animation.initial}
          animate={animation.animate}
        />
        <SearchDefault className="w-[512px] mx-auto" />
      </>
    </div>
  )
}
