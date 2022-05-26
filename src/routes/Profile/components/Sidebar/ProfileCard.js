import React from 'react'
import SmileFace from '../../../../assets/images/profile/smileface.png'

export default function ProfileCard() {
  return (
    <div className="flex min-w-[320px] account-profile-bg rounded-[16px] p-4 items-center">
      <div className="mr-4">
        <img src={SmileFace} />
      </div>
      <div>
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
