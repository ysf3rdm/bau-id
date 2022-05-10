import Increase from 'components/Increase'
import React from 'react'

export default function Registration() {
  return (
    <div className="pt-[20vh]">
      <div className="text-[28px] text-[#1EEFA4] font-cocoSharp px-[67px] py-2 border-[4px] border-[#1EEFA4] rounded-[22px] text-center">
        pepepefrog.bnb
      </div>
      <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 flex mt-8">
        <Increase className="mr-[13px]" />
        <span className="text-white font-bold font-urbanist text-[18px] flex items-center mr-[13px]">
          =
        </span>
        <div className="w-[180px] h-[40px] flex justify-center items-center font-bold font-urbanist bg-[#C4C4C4]/20 text-white font-bold font-urbanist text-[18px] rounded-[8px]">
          $5.55
        </div>
      </div>
    </div>
  )
}
