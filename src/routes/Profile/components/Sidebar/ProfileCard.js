import React from 'react'
import cn from 'classnames'
import SmileFace from '../../../../assets/images/profile/smileface.png'

export default function ProfileCard({ className }) {
  return (
    <div
      className={cn(
        'flex 1400px:min-w-[320px] account-profile-bg rounded-[16px] p-4 items-center',
        className
      )}
    >
      <div className="mr-4 flex-none w-[40px] xl:w-[64px]">
        <img src={SmileFace} />
      </div>
      <div className="pr-10">
        <div className="text-white font-semibold text-[18px]">
          (Unconnected)
        </div>
        <div>
          <span className="text-white text-[12px]">Domains -</span>
        </div>
        <button className="bg-[#335264] rounded-full px-[8px] text-white font-semibold text-[12px]">
          Connect wallet
        </button>
      </div>
    </div>
  )
}
