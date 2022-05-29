import React from 'react'
import EmailImg from 'assets/images/profile/email.png'
import cn from 'classnames'

export default function Address({
  description = 'example@email.com',
  imageUrl = EmailImg,
  title = 'Email',
  bgColorClass = 'bg-[rgba(50,126,164,0.6)]'
}) {
  return (
    <div
      className={cn(
        'rounded-[28px] w-full min-h-[56px] justify-center items-center text-white font-urbanist py-[9px] font-semibold text-[16px] pl-6 relative',
        bgColorClass
      )}
    >
      <div className="text-[12px] text-[#B1D6D3] font-urbanist">{title}</div>
      <div className="text-semibold">{description}</div>
      <div className="absolute right-0 top-[4px]">
        <img alt="email" src={imageUrl} />
      </div>
    </div>
  )
}
