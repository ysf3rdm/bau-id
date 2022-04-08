import React from 'react'
import { Stepper } from 'react-form-stepper'
import styled from '@emotion/styled/macro'

const ProgressContainer = styled('div')`
  margin-bottom: 40px;
`

const statesIndex = {
  COMMIT_CONFIRMED: 0,
  AWAITING_REGISTER: 1,
  REVEAL_SENT: 2,
  REVEAL_CONFIRMED: 3
}

function Progress({ step }) {
  if (step === 'PRICE_DECISION') return null

  return (
    <ProgressContainer>
      <Stepper
        steps={[{ label: '' }, { label: '' }, { label: '' }]}
        activeStep={statesIndex[step]}
        styleConfig={{
          activeBgColor: '#47C799',
          completedBgColor: '#47C799',
          circleFontSize: '12px',
          size: '24px'
        }}
        connectorStateColors={true}
        connectorStyleConfig={{
          activeColor: '#47C799  ',
          completedColor: '#47C799',
          size: 2
        }}
      />
    </ProgressContainer>
  )
}

export default Progress
