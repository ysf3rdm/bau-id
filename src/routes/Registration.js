import Increase from 'components/Increase'
import React from 'react'

export default function Registration() {
  return (
    <div className="pt-[20vh]">
      <div>
        <div className="text-[28px] text-[#1EEFA4] font-cocoSharp py-2 border-[4px] border-[#1EEFA4] rounded-[22px] text-center">
          pepepefrog.bnb
        </div>
      </div>

      <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 mt-8">
        <div className="flex">
          <div>
            <Increase className="mr-[13px]" />
            <div className="text-center text-white font-semibold mt-1">
              {' '}
              Registration Year{' '}
            </div>
          </div>

          <span className="text-white font-bold font-urbanist text-[18px] flex pt-2 mr-[13px]">
            =
          </span>
          <div>
            <div className="w-[180px] h-[40px] flex justify-center items-center font-bold font-urbanist bg-[#C4C4C4]/20 text-white font-bold font-urbanist text-[18px] rounded-[8px]">
              $5.55
            </div>
            <div className="text-center text-white font-semibold mt-1">
              {' '}
              Registration Fee{' '}
            </div>
          </div>
        </div>
        <div className="text-white py-[25px] border-y border-white border-dashed mt-6 px-6">
          <div className="flex justify-between">
            <div className="font-semibild text-[14px]">Xxxxxx Fee</div>
            <div className="font-bold text-[16px]">$2.22</div>
          </div>
          <div className="flex justify-between mt-[14px]">
            <div className="font-semibild text-[14px]">Xxxxxx Fee</div>
            <div className="font-bold text-[16px]">$1.11</div>
          </div>
          <div className="flex justify-between mt-[14px]">
            <div className="font-semibild text-[14px]">Discount</div>
            <div className="font-bold text-[16px]">-$1.11</div>
          </div>
        </div>
        <div className="text-center text-white mt-6">
          <div className="text-[14px]">Total Cost</div>
          <div className="font-bold text-[36px]">$9.99</div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button className="bg-[#30DB9E] font-semibold px-[37px] py-[9px] rounded-[16px]">
          Register
        </button>
      </div>
    </div>
  )
}
