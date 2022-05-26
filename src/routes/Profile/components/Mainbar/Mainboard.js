import React from 'react'

export default function Mainboard() {
  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] xl:h-[calc(100%-200px)] mt-[14px] py-4 px-[22px]">
      {/* Addresses panel */}
      <div id="address">
        <p className="text-center text-white font-semibold text-[18px] font-urbanist">
          Addresses
        </p>
        <div className="flex mt-3">
          <div className="bg-[rgba(204,252,255,0.2)] rounded-[28px] w-[300px] h-[56px] justify-center items-center flex text-white font-urbanist font-semibold text-[16px]">
            Nothing here:(
          </div>
        </div>
      </div>
      {/* Profile panel */}
      <div id="profile" className="mt-3">
        <p className="text-center text-white font-semibold text-[18px] font-urbanist">
          Profile
        </p>
        <div className="flex mt-3">
          <div className="bg-[rgba(204,252,255,0.2)] rounded-[28px] w-[300px] h-[56px] justify-center items-center flex text-white font-urbanist font-semibold text-[16px]">
            Nothing here:(
          </div>
        </div>
      </div>
    </div>
  )
}
