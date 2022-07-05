// Import packages
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { css } from 'emotion'
import { gql, useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { Mutation } from '@apollo/client/react/components'
import { useTranslation } from 'react-i18next'
import EthVal from 'ethval'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import { trackReferral } from '../../../utils/analytics'
import { REGISTER } from '../../../graphql/mutations'

import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'
import AddToCalendar from '../../Calendar/RenewalCalendar'
import { ReactComponent as DefaultPencil } from '../../Icons/SmallPencil.svg'
import { useAccount } from '../../QueryAccount'

import InsufficientBalanceModal from '../../Modal/InsufficientBalanceModal'
import AnimationSpin from '../../AnimationSpin/index'

import { startRegistering, errorRegistering } from 'app/slices/registerSlice'

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
  goBack,
  setCustomStep,
  startRegisterFuc,
  readOnly,
  isReadOnly
}) {
  const CTAs = {
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ label, duration, signature }}
        onCompleted={data => {
          console.log('data error', data?.register)
          console.log('data error', data?.register?.err)
          if (data?.register?.err) {
            // this is the error case
            setCustomStep('ERROR')
            errorRegistering()
            setRegistering(false)
          } else {
            // This is the success case
            successRegister()
            setRegistering(false)
          }
        }}
      >
        {mutate => (
          <>
            <div className="md:flex justify-between md:px-[48px] w-full">
              <button
                data-testid="request-register-button"
                disabled={isReadOnly || parseFloat(years) < 0.1}
                onClick={async () => {
                  if (hasSufficientBalance) {
                    startRegisterFuc()
                    setCustomStep('PENDING')
                    setRegistering(true)
                    mutate()
                  } else setShowSufficientBalanceModal(true)
                }}
                className={cn(
                  'order-2 font-semibold mx-auto px-[37px] py-[9px] rounded-[16px] flex items-center w-[160px] flex justify-center items-center',
                  isReadOnly || parseFloat(years) < 0.1
                    ? 'bg-[#7E9195] text-white cursor-not-allowed'
                    : 'bg-[#30DB9E]'
                )}
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
                className="order-1 mt-4 md:mt-0 mx-auto border-[#30DB9E] border text-[#30DB9E] font-semibold px-[37px] py-[9px] rounded-[16px] flex items-center w-[160px] flex justify-center items-center"
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

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

const CTA = ({
  setCustomStep,
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
  const dispatch = useDispatch()
  const [showSufficientBalanceModal, setShowSufficientBalanceModal] = useState(
    false
  )

  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: account
    }
  })

  const { isReadOnly } = data

  console.log('isReadOnly', isReadOnly)

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

  const startRegisterFuc = () => {
    dispatch(startRegistering())
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
        goBack,
        setCustomStep,
        startRegisterFuc,
        isReadOnly
      })}
    </div>
  )
}

export default CTA
