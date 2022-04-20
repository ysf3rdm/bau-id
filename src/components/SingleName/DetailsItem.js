import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

export const DetailsItem = styled('div')`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin-bottom: 20px;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: row;
`

export const DetailsKeyValueContainer = styled('div')`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
  }
`

export const DetailsKey = styled('div')`
  color: #379070;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: capitalize;
  flex-shrink: 0;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  margin-bottom: 0;
  font-size: 20px;
  max-width: 220px;
  min-width: 180px;
  @media (max-width: 768px) {
    font-size: 18px;
    width: 146px;
    min-width: 146px;
    max-width: 146px;
  }
`

export const DetailsValue = styled('div')`
  font-size: 20px;
  font-weight: 100;
  font-family: Urbanist Mono;
  white-space: nowrap;
  overflow: hidden;
  display: inline-flex;
  text-overflow: ellipsis;
  color: #379070;
  ${p =>
    p.editing &&
    p.editable &&
    mq.small`
      padding-right: 5px;
    `}

  a {
    display: flex;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    white-space: normal;
  }
`
/* Container element for key/value */
export const DetailsContent = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
  transition: 0.3s;
  flex-direction: row;
  align-items: center;

  @media (max-width: 768px) {
    display: block;
  }
`

export const DetailsContentContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
  transition: 0.3s;
  flex-direction: row;
  align-items: center;

  @media (max-width: 768px) {
    display: block;
  }
`

export const DetailsContentSubContainer = styled('div')`
  display: flex;
  align-items: center;
`
