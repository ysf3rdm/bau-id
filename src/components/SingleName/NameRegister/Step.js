import React from 'react'
import styled from '@emotion/styled/macro'

const offset = 180

const Number = styled('div')`
  color: ${p => (p.progress === 100 ? '#42E068' : '#dfdfdf')};
  font-size: 34px;
  font-weight: 300;
  position: relative;
  width: 60px;
  height: 60px;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

const SVG = styled('svg')`
  stroke: #ccc;

  circle {
    stroke-dasharray: ${offset};
    stroke-dashoffset: 0;
  }

  circle.progress {
    stroke-dasharray: ${offset};
    stroke-dashoffset: ${p => (offset / 100) * (p.progress - 100)};
  }
`

const Content = styled('div')`
  margin-left: 8px;
  font-family: Urbanist;

  h3 {
    margin-top: 2px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  p {
    font-size: 12px;
    font-weight: 400;
    margin-top: 0;
    color: #7a7a7a;
  }

  @media (max-width: 768px) {
    line-height: 22px;
    h3 {
      font-size: 16px;
    }
    p {
      font-size: 16px;
    }
  }
`

const ContentContainer = styled('div')`
  display: flex;
  align-items: center;
`

const Badge = styled('div')`
  background-color: #47c799;
  width: 24px;
  height: 24px;
  display: none;
  justify-content: center;
  align-items: center;
  color: white;
  flex: none;
  border-radius: 50%;
  @media (max-width: 768px) {
    display: flex;
  }
  background-color: ${p => (p.completed ? '#47C799' : '#dfdfdf')};
`

const StepContainer = styled('div')`
  display: flex;
`

const statesIndex = {
  COMMIT_CONFIRMED: 0,
  AWAITING_REGISTER: 1,
  REVEAL_SENT: 2,
  REVEAL_CONFIRMED: 3
}

const Step = ({ number, text, title, progress = 100, step = 0 }) => (
  <StepContainer>
    <ContentContainer>
      <Badge completed={number < statesIndex[step] + 1}>{number}</Badge>
      <Content>
        <h3 style={{ color: '#379070' }}>{title}</h3>
        <p>{text}</p>
      </Content>
    </ContentContainer>
  </StepContainer>
)

export default Step
