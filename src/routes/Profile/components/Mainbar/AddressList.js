import React from 'react'
import cn from 'classnames'

export default function AddressList({ className }) {
  return (
    <div
      className={cn(
        'bg-[rgba(72,143,139,0.25)] rounded-[24px] xl:flex px-8 py-4',
        className
      )}
    >
      <div className="grid grid-cols-1 gap-y-3 1200px:grid-cols-3 gap-x-4 px-4 xl:border-r border-[rgba(204,252,255,0.2)]">
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Registrant</p>
          <p className="font-semibold text-[18px] font-urbanist">
            0x1a2b...3c4000
          </p>
        </div>
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Controller</p>
          <p className="font-semibold text-[18px] font-urbanist">
            0x1a2b...3c4000
          </p>
        </div>
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Registrant</p>
          <p className="font-semibold text-[18px] font-urbanist">
            0x1a2b...3c4000
          </p>
        </div>
      </div>
      <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white ml-4 mt-3 xl:mt-0">
        <p className="text-[#B1D6D3] text-[14px] font-semibold">Visit</p>
        <p className="font-semibold text-[18px] font-urbanist">Subdomain</p>
      </div>
    </div>
  )
}
