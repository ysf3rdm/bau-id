import React, { useState } from 'react'
import NoAccounts from './NoAccounts'

export default ({
  colour,
  buttonText,
  onClick,
  textColour,
  className,
  active,
  width
}) => {
  return (
    <div className={className}>
      <NoAccounts
        colour={colour || '#25FFB1'}
        buttonText={buttonText}
        textColour={textColour}
        active={active}
        onClick={onClick}
        width={width}
      />
    </div>
  )
}
