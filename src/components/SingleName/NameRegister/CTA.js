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
import { registerLoadingReactive } from 'apollo/reactiveVars'

import InsufficientBalanceModal from '../../Modal/InsufficientBalanceModal'
import { useReactiveVarListeners } from 'hooks/useReactiveVarListeners'
import AnimationSpin from '../../AnimationSpin/index'

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
  signature,
  setShowSufficientBalanceModal,
  successRegister,
  setRegistering,
  registering,
  goBack
}) {
  const CTAs = {
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ label, duration, signature }}
        onCompleted={data => {
          successRegister()
          setRegistering(false)
        }}
        onError={err => {
          setRegistering(false)
          console.log('err', err)
        }}
      >
        {mutate => (
          <>
            <div className="flex justify-between px-[48px] w-full">
              <button
                data-testid="request-register-button"
                onClick={async () => {
                  if (hasSufficientBalance) {
                    setRegistering(true)
                    mutate()
                  } else setShowSufficientBalanceModal(true)
                }}
                className="bg-[#30DB9E] font-semibold px-[37px] py-[9px] rounded-[16px] flex items-center w-[160px] flex justify-center items-center"
              >
                Register{' '}
                {registering && (
                  <div className="ml-2">
                    <AnimationSpin />
                  </div>
                )}
              </button>
              <button
                onClick={goBack}
                className="border-[#30DB9E] border text-[#30DB9E] font-semibold px-[37px] py-[9px] rounded-[16px] flex items-center w-[160px] flex justify-center items-center"
              >
                Go Back
              </button>
            </div>
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
  signature,
  successRegister
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const account = useAccount()
  const [txHash, setTxHash] = useState(undefined)
  const [registering, setRegistering] = useState(false)
  const [showSufficientBalanceModal, setShowSufficientBalanceModal] = useState(
    false
  )

  useEffect(() => {
    return () => {
      if (step === 'REVEAL_CONFIRMED') {
        refetch()
      }
    }
  }, [step])

  const goBack = () => {
    history.push('/')
  }

  return (
    <div className="mt-8 flex justify-between items-end">
      {showSufficientBalanceModal && (
        <InsufficientBalanceModal
          closeModal={() => setShowSufficientBalanceModal(false)}
        />
      )}
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
        signature,
        setShowSufficientBalanceModal,
        successRegister,
        setRegistering,
        registering,
        goBack
      })}
    </div>
  )
}

export default CTA
