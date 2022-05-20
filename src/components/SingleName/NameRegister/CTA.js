import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { css } from 'emotion'
import { useHistory } from 'react-router-dom'
import { Mutation } from '@apollo/client/react/components'
import { useTranslation } from 'react-i18next'
import EthVal from 'ethval'

import { trackReferral } from '../../../utils/analytics'
import { REGISTER } from '../../../graphql/mutations'

import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'
import AddToCalendar from '../../Calendar/RenewalCalendar'
import { ReactComponent as DefaultPencil } from '../../Icons/SmallPencil.svg'
import { useAccount } from '../../QueryAccount'

function getCTA({
  step,
  incrementStep,
  duration,
  label,
  hasSufficientBalance,
  txHash,
  refetch,
  refetchIsMigrated,
  price,
  years,
  premium,
  history,
  ethUsdPrice,
  account,
  signature
}) {
  const CTAs = {
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ label, duration, signature }}
        onCompleted={data => {
          console.log('register result:', data)
        }}
        onError={err => {
          console.log('err', err)
        }}
      >
        {mutate => (
          <>
            {hasSufficientBalance ? (
              <>
                <button
                  data-testid="request-register-button"
                  onClick={() => {
                    if (hasSufficientBalance) mutate()
                  }}
                  className="bg-[#30DB9E] font-semibold px-[37px] py-[9px] rounded-[16px]"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span>
                  *Insufficient balance on your wallet. Fill in your wallet and
                  reload the page.
                </span>
                <Button data-testid="register-button" type="disabled">
                  *
                </Button>
              </>
            )}
          </>
        )}
      </Mutation>
    ),
    REVEAL_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={async () => {
          if (ethUsdPrice) {
            // this is not set on local test env
            trackReferral({
              transactionId: txHash,
              labels: [label],
              type: 'register', // renew/register
              price: new EthVal(`${price._hex}`)
                .toEth()
                .mul(ethUsdPrice)
                .toFixed(2), // in wei, // in wei
              years,
              premium
            })
          }
          incrementStep()
        }}
      />
    ),
    REVEAL_CONFIRMED: (
      <div>
        <AddToCalendar
          css={css`
            margin-right: 20px;
          `}
          name={`${label}.bnb`}
          startDatetime={moment()
            .utc()
            .local()
            .add(duration, 'seconds')
            .subtract(30, 'days')}
        />
        <Link
          className="mr-[20px]"
          onClick={async () => {
            await Promise.all([refetch(), refetchIsMigrated()])
            history.push(`/name/${label}.bnb`)
          }}
          data-testid="manage-name-button"
        >
          Manage name
        </Link>
        <Button
          style={{
            color: '#5ED6AB',
            background: 'none',
            border: '2px solid #5ED6AB'
          }}
          onClick={async () => {
            await Promise.all([refetchIsMigrated()])
            history.push(`/address/${account}`)
          }}
        >
          <DefaultPencil className="mr-[5px]" />
          Set as Primary SID Name
        </Button>
      </div>
    )
  }
  return CTAs[step]
}

const CTA = ({
  step,
  incrementStep,
  secret,
  duration,
  label,
  hasSufficientBalance,
  setTimerRunning,
  setCommitmentTimerRunning,
  commitmentTimerRunning,
  setBlockCreatedAt,
  isAboveMinDuration,
  refetch,
  refetchIsMigrated,
  readOnly,
  price,
  years,
  premium,
  ethUsdPrice,
  signature
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const account = useAccount()
  const [txHash, setTxHash] = useState(undefined)

  useEffect(() => {
    return () => {
      if (step === 'REVEAL_CONFIRMED') {
        refetch()
      }
    }
  }, [step])

  return (
    <div className="mt-8 flex justify-center items-end">
      {getCTA({
        step,
        incrementStep,
        secret,
        duration,
        label,
        hasSufficientBalance,
        txHash,
        setTxHash,
        setTimerRunning,
        setBlockCreatedAt,
        setCommitmentTimerRunning,
        commitmentTimerRunning,
        isAboveMinDuration,
        refetch,
        refetchIsMigrated,
        readOnly,
        price,
        years,
        premium,
        history,
        t,
        ethUsdPrice,
        account,
        signature
      })}
    </div>
  )
}

export default CTA
