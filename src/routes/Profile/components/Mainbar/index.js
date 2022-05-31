import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddressList from './AddressList'
import Mainboard from './Mainboard'
import EditButton from '../../../../components/Button/EditButton'
import { toggleEditMode } from 'app/slices/accountSlice'

export default function Mainbar() {
  const editOn = useSelector(state => state.account.profileEditMode)
  const dispatch = useDispatch()

  const toggleOn = param => {
    console.log('param', param)
    dispatch(toggleEditMode(param))
  }

  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-5 relative">
      <div className="text-center">
        <div className="text-[#1EEFA4] text-[32px] font-bold">pepefrog.bnb</div>
        <div className="text-white text-urbanist font-semibold text-[14px]">
          Expiration Date: 2023.04.22 at 08:00 (UTC+8:00)
        </div>
      </div>
      <EditButton
        className="absolute top-[20px] right-[20px]"
        isON={editOn}
        handleClick={toggleOn}
      />
      <AddressList className="mt-[14px]" />
      <Mainboard />
    </div>
  )
}
