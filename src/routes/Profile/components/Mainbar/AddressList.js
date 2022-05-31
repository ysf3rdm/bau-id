import React from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import { toggleSubDomainEditMode } from 'app/slices/uiSlice'

export default function AddressList({ className }) {
  const subDomainEditMode = useSelector(state => state.ui.subDomainEditMode)
  const dispatch = useDispatch()

  const toggleSubDomainEditModeHandle = () => {
    dispatch(toggleSubDomainEditMode(!subDomainEditMode))
  }

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
      <div
        onClick={() => toggleSubDomainEditModeHandle()}
        className={cn(
          'rounded-[89px] px-[43px] py-2 text-center text-white ml-4 mt-3 xl:mt-0 cursor-pointer',
          subDomainEditMode ? 'bg-[#30DB9E]' : 'bg-[rgba(204,252,255,0.2)]'
        )}
      >
        <p
          className={cn(
            'text-[14px] font-semibold',
            subDomainEditMode ? 'text-white' : 'text-[#B1D6D3]'
          )}
        >
          Visit
        </p>
        <p className="font-semibold text-[18px] font-urbanist">Subdomain</p>
      </div>
    </div>
  )
}
