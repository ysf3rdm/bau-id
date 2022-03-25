import React from 'react'
import styled from '@emotion/styled/macro'
import Icon from './IconBase'

const SVG = styled(Icon)``

const Heart = ({ active, className }) => (
  <svg
    width="19"
    height="16"
    viewBox="0 0 19 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.65241 1C3.1747 1 1.16602 3.00868 1.16602 5.4864C1.16602 9.97279 6.46812 14.0513 9.3231 15C12.1781 14.0513 17.4802 9.97279 17.4802 5.4864C17.4802 3.00868 15.4715 1 12.9938 1C11.4766 1 10.1347 1.75331 9.3231 2.90631C8.9094 2.31705 8.35981 1.83614 7.72086 1.50431C7.0819 1.17248 6.37239 0.999492 5.65241 1Z"
      stroke="#B1B1B1"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

export default Heart
