import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import NoAccounts from './NoAccounts'

export default ({
  colour,
  buttonText,
  onClick,
  textColour,
  className,
  active
}) => {
  let [showModal, setShowModal] = useState(active)
  return (
    <div className={className}>
      <NoAccounts
        colour={colour || '#25FFB1'}
        buttonText={buttonText}
        textColour={textColour}
        active={active}
        onClick={onClick}
      />
    </div>
  )
}
