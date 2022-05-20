import React from 'react'
import cn from 'classnames'

export default function Increase({
  handleChange,
  className,
  decrementYears,
  incrementYears,
  years,
}) {
  return (
    <div
      className={cn(
        'w-[180px] h-[40px] bg-[#C4C4C4]/20 flex rounded-[8px] items-center justify-between px-2',
        className
      )}
    >
      <button
        disabled={years < 1}
        onClick={decrementYears}
        className="w-[24px] h-[24px] bg-[#7E9195] flex justify-center items-center text-white rounded-[4px] cursor-pointer"
      >
        -
      </button>
      <div className="text-white font-bold font-urbanist text-[18px]">
        {years}
      </div>
      <button
        onClick={incrementYears}
        className="w-[24px] h-[24px] bg-[#0EA59C]/50 flex justify-center items-center text-white rounded-[4px] cursor-pointer"
      >
        +
      </button>
    </div>
  )
}
