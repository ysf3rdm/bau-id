import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import AddressList from './AddressList'
import Mainboard from './Mainboard'
import EditButton from '../../../../components/Button/EditButton'
import { toggleEditMode } from 'app/slices/accountSlice'

export default function Mainbar({ sid, selectedDomain }) {
  const editOn = useSelector(state => state.account.profileEditMode)
  const dispatch = useDispatch()

  const toggleOn = param => {
    dispatch(toggleEditMode(param))
  }

  if (selectedDomain) {
    console.log(selectedDomain?.expires_at.split(',')[0])
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

      <EditButton
        className="absolute top-[20px] right-[20px]"
        isON={editOn}
        handleClick={toggleOn}
      />
      <AddressList
        className="mt-[14px]"
        sid={sid}
        selectedDomain={selectedDomain}
      />
      <Mainboard />
    </div>
  )
}
