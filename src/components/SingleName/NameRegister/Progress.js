import React from 'react'
import styled from '@emotion/styled/macro'

import { hasReachedState } from './registerReducer'

import { ReactComponent as DefaultQuestionMark } from 'components/Icons/QuestionMarkSmall.svg'
import { ReactComponent as DefaultCheckCircle } from 'components/Icons/CheckCircle.svg'

const ProgressContainer = styled('div')`
  margin-bottom: 40px;
`

const states = {
  PRICE_DECISION: 0,
  COMMIT_SENT: 12.5,
  COMMIT_CONFIRMED: 25,
  AWAITING_REGISTER: 75,
  REVEAL_SENT: 85,
  REVEAL_CONFIRMED: 100
}

const ProgressBar = styled('div')`
  height: 20px;
  width: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
  background: ${({ percentDone }) =>
      percentDone &&
      `
        linear-gradient(to right, #AFFF8C 0%, #42E068 ${percentDone}%, transparent ${percentDone}%),`}
    rgba(66, 224, 104, 0.1);
`

const Steps = styled('div')`
  display: flex;
  margin-bottom: 20px;
  margin-top: 12px;
`

const StepContainer = styled('section')`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  &:last-of-type {
    border-right: 1px dotted #ccc;
  }
`

const StepContent = styled('div')`
  top: -10px;
  position: absolute;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-family: Urbanist;
  color: white;
  display: flex;
  align-items: center;
  background: white;
  background-color: #47c799;
  border-radius: 50%;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: -12px;
  transition: 0.2s;

  &:hover {
    color: ${p =>
      p.completed ? 'hsla(134, 72%, 57%, 1)' : 'hsla(227, 58%, 41%, 1)'};

    circle {
      fill: hsla(227, 58%, 41%, 1);
    }
  }
`

const QuestionMark = styled(DefaultQuestionMark)`
  margin-left: 5px;
  margin-bottom: 2px;
  transition: 0.2s;
`

const CheckCircle = styled(DefaultCheckCircle)`
  margin-left: 5px;
  margin-bottom: 2px;
`

const HalfContainer = styled('div')`
  width: 50%;
`

const BorderContainer = styled('div')`
  width: 50%;
  border: 2px solid #47c799;
`

function Step({
  children,
  completed,
  text,
  large,
  icon,
  onMouseOver,
  onMouseLeave
}) {
  return (
    <StepContainer large={large}>
      {text === '1' ? <HalfContainer /> : <BorderContainer />}
      {text === '3' ? <HalfContainer /> : <BorderContainer />}
      <StepContent
        completed={completed}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {children}
        {text}
        {/* {icon} */}
      </StepContent>
    </StepContainer>
  )
}

function Progress({ step, waitPercentComplete }) {
  if (step === 'PRICE_DECISION') return null

  const waitMin = states['COMMIT_CONFIRMED']
  const waitMax = states['AWAITING_REGISTER']
  const percentDone = waitPercentComplete / (100 / (waitMax - waitMin)) + 25

  return (
    <ProgressContainer>
      {/* <ProgressBar
        percentDone={step !== 'COMMIT_CONFIRMED' ? states[step] : percentDone}
      /> */}
      <Steps>
        <Step
          text="1"
          completed={hasReachedState('COMMIT_CONFIRMED', step)}
          icon={
            hasReachedState('COMMIT_CONFIRMED', step) ? (
              <CheckCircle />
            ) : (
              <QuestionMark />
            )
          }
          onMouseOver={() => {
            showTooltip()
          }}
          onMouseLeave={() => {
            hideTooltip()
          }}
        />
        <Step
          large
          text="2"
          completed={hasReachedState('AWAITING_REGISTER', step)}
          icon={
            hasReachedState('AWAITING_REGISTER', step) ? (
              <CheckCircle />
            ) : (
              <QuestionMark />
            )
          }
          onMouseOver={() => {
            showTooltip()
          }}
          onMouseLeave={() => {
            hideTooltip()
          }}
        />

        <Step
          completed={hasReachedState('REVEAL_CONFIRMED', step)}
          text="3"
          icon={
            hasReachedState('REVEAL_CONFIRMED', step) ? (
              <CheckCircle />
            ) : (
              <QuestionMark />
            )
          }
          onMouseOver={() => {
            showTooltip()
          }}
          onMouseLeave={() => {
            hideTooltip()
          }}
        />
      </Steps>
    </ProgressContainer>
  )
}

export default Progress
