import React from 'react'
import AddressList from './AddressList'

export default function Mainbar() {
  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-5">
      <div className="text-center">
        <div className="text-[#1EEFA4] text-[32px] font-bold">pepefrog.bnb</div>
        <div className="text-white text-urbanist font-semibold text-[14px]">
          Expiration Date: 2023.04.22 at 08:00 (UTC+8:00)
        </div>
      </div>
      <AddressList className="mt-[14px]" />
    </div>
  )
}
