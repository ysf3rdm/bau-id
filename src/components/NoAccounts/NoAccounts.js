import React from 'react'
import AnimationSpin from 'components/AnimationSpin'

export default function NoAccounts({
  colour = '#ffffff',
  textColour,
  onClick,
  buttonText,
  active,
  loadingWallet,
  width,
  isReadOnly
}) {
  return (
    <button
      colour={colour}
      onClick={onClick}
      active={active}
      textColour={textColour}
      width={width}
      disabled={!isReadOnly}
      className="bg-[#0ea59c]/[0.85] px-[26px] py-[7px] rounded-[16px] backdrop-blur-[10px] cursor-pointer"
    >
      <span className="text-white text-[18px] font-semibold font-urbanist uppercase flex items-center">
        {buttonText}{' '}
        {loadingWallet && (
          <div className="ml-2">
            <AnimationSpin />
          </div>
        )}
      </span>
    </button>
  )
}
