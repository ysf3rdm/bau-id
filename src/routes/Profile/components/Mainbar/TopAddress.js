import React from 'react'
import cn from 'classnames'
import moment from 'moment'

//Import Components
import CopyIcon from 'components/Icons/CopyIcon'

//Import Assets
import NameCard from '../../../../assets/images/profile/name-card.png'
import Info from 'components/Icons/Info'
import NotifyIcon from 'components/Icons/NotifyIcon'
import AnimationSpin from 'components/AnimationSpin'

export default function TopAddress({
  className,
  selectedDomain,
  registrantAddress,
  loadingRegistration
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-x-[28px]', className)}>
      <div className="relative">
        <img alt="name-card" src={NameCard} />
        <div className="top-[calc(50%-30px)] right-[calc(50%-125px)] absolute text-[40px] font-bold text-white">
          {selectedDomain?.name}
          <span className="text-[#1EEFA4]">.bnb</span>
        </div>
      </div>
      <div className="flex flex-col justify-between py-2">
        <div>
          <p className="font-bold text-[24px] text-[#1EEFA4]">Registrant</p>
          {loadingRegistration ? (
            <AnimationSpin />
          ) : (
            <div className="flex text-[18px] text-white font-semibold items-center mt-2">
              <p>{registrantAddress}</p>
              <div className="ml-2">
                <CopyIcon />
              </div>
            </div>
          )}

          <div className="flex items-center mt-4">
            <button className="text-white py-2 px-6 bg-[#7E9195] rounded-full mr-4">
              Transfer
            </button>
            <Info />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-[20px] text-[#1EEFA4]">
              Expiration Date
            </p>
            <div className="flex text-[18px] text-white font-semibold items-center mt-2">
              {/* <p>2023.04.22 at 08:00 (UTC+8:00)</p> */}
              <p>
                {moment(
                  selectedDomain?.expires_at.split(',')[0].replaceAll('.', '-')
                ).format('YYYY.MM.DD')}
                <span className="mx-1">at</span>
                {moment(
                  selectedDomain?.expires_at.split(',')[0].replaceAll('.', '-')
                ).format('hh:mm')}
                <span className="ml-1">(UTC+8:00)</span>
              </p>
              <div className="ml-2">
                <NotifyIcon />
              </div>
            </div>
          </div>
          <div>
            <button className="text-[#134757] font-semibold text-[16px] py-2 px-[28px] rounded-full bg-[#30DB9E]">
              Extend
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
