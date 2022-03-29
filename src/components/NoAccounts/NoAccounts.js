import React from 'react'
import styled from '@emotion/styled/macro'

const NoAccountsContainer = styled('div')`
  box-shadow: ${({ active }) =>
    active ? '0 -10px 30px 0 rgba(108, 143, 167, 0.05)' : 'none'};
  padding: 13.2px 13.46px 13.2px 13px;
  border-bottom: 1px solid #25ffb1;
  border-top: 1px solid #25ffb1;
  border-left: 1px solid #25ffb1;
  border-right: 1px solid #25ffb1;
  border-radius: 13px;
  background: 'transparent';
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 146px;
  transition: 0.2s;

  span {
    color: #25ffb1;
  }

  @media (max-width: 768px) {
    width: 100%;
    span {
      color: ${({ active, colour }) =>
        active ? '#0191E2' : 'white'} !important;
    }
    border-bottom: 1px solid
      ${({ active, colour }) => (active ? '#0191E2' : 'white')};
    border-top: ${({ active, colour }) =>
      `1px solid ${active ? '#0191E2' : 'white'}`};
    border-left: ${({ active, colour }) =>
      `1px solid ${active ? '#0191E2' : 'white'}`};
    border-right: ${({ active, colour }) =>
      `1px solid ${active ? '#0191E2' : 'white'}`};
  }

  &:hover {
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};
  }
`

const SVG = styled('svg')`
  margin-right: 10px;
`

const NoAccounts = ({
  className,
  colour = '#ffffff',
  textColour,
  onClick,
  buttonText,
  active
}) => (
  <NoAccountsContainer
    colour={colour}
    className={className}
    onClick={onClick}
    active={active}
    textColour={textColour}
  >
    <span>{buttonText}</span>
  </NoAccountsContainer>
)

export default NoAccounts
