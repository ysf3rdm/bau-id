import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import AddressList from './AddressList'
import Mainboard from './Mainboard'
import AnimationSpin from 'components/AnimationSpin'
import EditButton from '../../../../components/Button/EditButton'
import { toggleEditMode } from 'app/slices/accountSlice'

export default function Mainbar({
  sid,
  selectedDomain,
  isAccountConnected,
  account
}) {
  const editOn = useSelector(state => state.account.profileEditMode)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const toggleOn = param => {
    dispatch(toggleEditMode(param))
  }

  if (loading) {
    return (
      <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-5 relative min-w-[840px] flex justify-center items-center">
        <AnimationSpin size={60} />
      </div>
    )
  }

  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-5 relative">
      {selectedDomain && (
        <div className="text-center">
          <div className="text-[#1EEFA4] text-[32px] font-bold">
            {selectedDomain?.name}.bnb
          </div>
          <div className="text-white text-urbanist font-semibold text-[14px]">
            Expiration Date:{' '}
            {moment(
              selectedDomain?.expires_at.split(',')[0].replaceAll('.', '-')
            ).format('YYYY-MM-DD hh:mm')}
          </div>
        </div>
      )}
      {isAccountConnected && (
        <EditButton
          className="absolute top-[20px] right-[20px]"
          isON={editOn}
          handleClick={toggleOn}
        />
      )}

      <AddressList
        className="mt-[14px]"
        sid={sid}
        selectedDomain={selectedDomain}
        canEdit={editOn}
        account={account}
      />
      {selectedDomain && <Mainboard selectedDomain={{ ...selectedDomain }} />}
    </div>
  )
}
