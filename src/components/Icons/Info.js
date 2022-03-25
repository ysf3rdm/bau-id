import React, { Component } from 'react'
import styled from '@emotion/styled/macro'

class Info extends Component {
  render() {
    const { className, onClick, onMouseOver, onMouseLeave } = this.props

    return (
      <InfoContainer
        width="18"
        height="18"
        className={className}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        <svg
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.16602 17C13.5843 17 17.166 13.4183 17.166 9C17.166 4.58172 13.5843 1 9.16602 1C4.74774 1 1.16602 4.58172 1.16602 9C1.16602 13.4183 4.74774 17 9.16602 17Z"
            stroke="#B1B1B1"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.16602 13V8"
            stroke="#B1B1B1"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="9.16602" cy="5" r="1" fill="#B1B1B1" />
        </svg>
      </InfoContainer>
    )
  }
}

const InfoContainer = styled('svg')`
  opacity: 1 !important;
  margin-left: 0px !important;
  margin-right: 5px;

  &:hover {
    path {
      stroke: #47c799;
      fill: transparent;
    }
    circle {
      fill: #47c799;
    }

    background: transparent;
  }
`

export default Info
