import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import { toggleSubDomainEditMode } from 'app/slices/uiSlice'
import { convertToETHAddressDisplayFormat } from '../../../../utils/utils'

export default function AddressList({ className, sid, selectedDomain }) {
  const [controllerAddress, setControllerAddress] = useState('')
  const [resolverAddress, setResolverAddress] = useState('')
  const [sidAddress, setSidAddress] = useState('')
  const subDomainEditMode = useSelector(state => state.ui.subDomainEditMode)
  const dispatch = useDispatch()

  const toggleSubDomainEditModeHandle = () => {
    dispatch(toggleSubDomainEditMode(!subDomainEditMode))
  }

  const fetchInfo = async () => {
    console.log('sid', sid)
    console.log('selectedDomain', selectedDomain)
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const address = await nameUI.getOwner()
    setControllerAddress(address)
    const resolver = await nameUI.getResolver()
    setResolverAddress(resolver)
    const tSidAddress = await nameUI.getAddress()
    setSidAddress(tSidAddress)
  }

  useEffect(() => {
    if (sid && selectedDomain) {
      fetchInfo()
    }
  }, [sid, selectedDomain])

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
            <span>
              {sidAddress
                ? convertToETHAddressDisplayFormat(sidAddress)
                : '0x0000...000000'}
            </span>
          </p>
        </div>
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Controller</p>
          <p className="font-semibold text-[18px] font-urbanist">
            <span>
              {controllerAddress
                ? convertToETHAddressDisplayFormat(controllerAddress)
                : '0x0000...000000'}
            </span>
          </p>
        </div>
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Resolver</p>
          <p className="font-semibold text-[18px] font-urbanist">
            <span>
              {resolverAddress
                ? convertToETHAddressDisplayFormat(resolverAddress)
                : '0x0000...000000'}
            </span>
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
