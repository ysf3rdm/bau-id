import React from 'react'
import styled from '@emotion/styled/macro'
import Icon from './IconBase'

const SVG = styled(Icon)``

const File = ({ active, className }) => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.16667 9.08333C7.14162 9.08333 5.5 7.44171 5.5 5.41667C5.5 3.39162 7.14162 1.75 9.16667 1.75C11.1917 1.75 12.8333 3.39162 12.8333 5.41667C12.8333 7.44171 11.1917 9.08333 9.16667 9.08333Z"
      stroke="#B1B1B1"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M1.83301 18.25V17.3334C1.83301 14.2958 4.29544 11.8334 7.33301 11.8334H10.9997C14.0372 11.8334 16.4997 14.2958 16.4997 17.3334V18.25"
      stroke="#B1B1B1"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
)

export default File
