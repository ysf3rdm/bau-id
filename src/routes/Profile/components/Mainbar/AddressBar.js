import React from 'react'

import AnimationSpin from 'components/AnimationSpin'

import { convertToETHAddressDisplayFormat } from 'utils/utils'

export default function AddressBar({
  loading,
  address,
  label,
  canEdit,
  clickHandler,
  clickHandlerLabel
}) {
  return (
    <div className="cursor-pointer group relative bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white 1200px:w-[224px]">
      {canEdit && (
        <div
          onClick={clickHandler}
          className="absolute hidden group-hover:flex w-full h-full bg-[rgba(72,143,139,0.25)] top-0 left-0 rounded-[28px] border-[2px] border-[#30DB9E] backdrop-blur-[8px] justify-center items-center font-semibold text-[18px]"
        >
          <span>{clickHandlerLabel}</span>
        </div>
      )}
      <p className="text-[#B1D6D3] text-[14px] font-semibold">{label}</p>
      {loading ? (
        <AnimationSpin className="flex justify-center mt-1" />
      ) : (
        <p className="font-semibold text-[18px] font-urbanist">
          {convertToETHAddressDisplayFormat(address)}
        </p>
      )}
    </div>
  )
}
