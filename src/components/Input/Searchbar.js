import React from 'react'
import cn from 'classnames'

import SearchIcon from 'components/Icons/SearchIcon'

export default function Searchbar({ className }) {
  return (
    <div className={cn('relative w-full', className)}>
      <SearchIcon className="text-[rgba(204,252,255,0.3)] absolute top-[7px] left-[10px]" />
      <input className="border-[rgba(204,252,255,0.3)] border rounded-[16px] bg-transparent w-full h-[30px] pl-[30px]" />
    </div>
  )
}
