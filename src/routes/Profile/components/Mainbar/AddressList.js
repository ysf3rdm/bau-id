import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import AnimationSpin from 'components/AnimationSpin'

import { toggleSubDomainEditMode } from 'app/slices/uiSlice'
import { convertToETHAddressDisplayFormat } from '../../../../utils/utils'

export default function AddressList({ className, sid, selectedDomain }) {
  const [controllerAddress, setControllerAddress] = useState('')
  const [resolverAddress, setResolverAddress] = useState('')
  const [sidAddress, setSidAddress] = useState('')
  const subDomainEditMode = useSelector(state => state.ui.subDomainEditMode)
  const dispatch = useDispatch()

  const [loadingRegisteration, setLoadingRegisteration] = useState(true)
  const [loadingControllerAddress, setLoadingControllerAddress] = useState(true)
  const [loadingResolverAddress, setLoadingResolverAddress] = useState(true)

  const toggleSubDomainEditModeHandle = () => {
    dispatch(toggleSubDomainEditMode(!subDomainEditMode))
  }

  const fetchInfo = async () => {
    try {
      const nameUI = sid.name(`${selectedDomain.name}.bnb`)
      const resolver = await nameUI.getResolver()
      setResolverAddress(resolver)
      setLoadingResolverAddress(false)
    } catch (err) {
      console.log('err')
      console.log(err)
    }
  }

  const fetchControllerAddress = async () => {
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const address = await nameUI.getOwner()
    setControllerAddress(address)
    setLoadingControllerAddress(false)
  }

  const fetchSidAddress = async () => {
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const tSidAddress = await nameUI.getAddress()
    setSidAddress(tSidAddress)
    setLoadingRegisteration(false)
  }

  useEffect(() => {
    if (sid && selectedDomain) {
      setLoadingRegisteration(true)
      setLoadingControllerAddress(true)
      setLoadingResolverAddress(true)

      fetchInfo()
      fetchControllerAddress()
      fetchSidAddress()
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
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white 1200px:w-[224px]">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Registrant</p>
          {loadingRegisteration ? (
            <AnimationSpin className="flex justify-center mt-1" />
          ) : (
            <p className="font-semibold text-[18px] font-urbanist">
              {convertToETHAddressDisplayFormat(sidAddress)}
            </p>
          )}
        </div>
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white 1200px:w-[224px]">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Controller</p>
          {loadingControllerAddress ? (
            <AnimationSpin className="flex justify-center mt-1" />
          ) : (
            <p className="font-semibold text-[18px] font-urbanist">
              {convertToETHAddressDisplayFormat(controllerAddress)}
            </p>
          )}
        </div>
        <div className="bg-[rgba(204,252,255,0.2)] rounded-[89px] px-[43px] py-2 text-center text-white 1200px:w-[224px]">
          <p className="text-[#B1D6D3] text-[14px] font-semibold">Resolver</p>
          {loadingResolverAddress ? (
            <AnimationSpin className="flex justify-center mt-1" />
          ) : (
            <p className="font-semibold text-[18px] font-urbanist">
              {convertToETHAddressDisplayFormat(resolverAddress)}
            </p>
          )}
        </div>
      </div>
      <div
        onClick={() => toggleSubDomainEditModeHandle()}
        className={cn(
          'rounded-[89px] px-[43px] py-2 text-center text-white mx-4 mt-3 xl:mt-0 cursor-pointer',
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
