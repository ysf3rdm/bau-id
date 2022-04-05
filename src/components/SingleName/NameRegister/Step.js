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
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    margin-top: 0;
    color: #7a7a7a;
  }
`

const StepContainer = styled('div')`
  display: flex;
`

const Step = ({ number, text, title, progress = 100 }) => (
  <StepContainer>
    <Content>
      <h3 style={{ color: '#379070' }}>{title}</h3>
      <p>{text}</p>
    </Content>
  </StepContainer>
)

export default Step
