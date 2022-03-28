import React from 'react'
import styled from '@emotion/styled/macro'

export default function HamburgerIcon({ size = 25 }) {
  return (
    <HamburgerIconContainer>
      <svg
        width={size}
        viewBox="0 0 25 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="1.5"
          y1="2"
          x2="23.5"
          y2="2"
          stroke="#25FFB1"
          stroke-width="3"
          stroke-linecap="round"
        />
        <line
          x1="1.5"
          y1="11.8276"
          x2="23.5"
          y2="11.8276"
          stroke="#25FFB1"
          stroke-width="3"
          stroke-linecap="round"
        />
        <line
          x1="1.5"
          y1="21"
          x2="23.5"
          y2="21"
          stroke="#25FFB1"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </HamburgerIconContainer>
  )
}

const HamburgerIconContainer = styled('div')`
  color: #25ffb1;
`
