import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import NoAccounts from './NoAccounts'

export default ({ colour, buttonText, onClick, textColour, className }) => {
  let [showModal, setShowModal] = useState(false)
  return (
    <div className={className}>
      <NoAccounts
        colour={colour || '#25FFB1'}
        buttonText={buttonText}
        textColour={textColour}
        active={showModal}
        onClick={onClick}
      />
    </div>
  )
}
