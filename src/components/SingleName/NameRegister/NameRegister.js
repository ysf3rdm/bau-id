import React, { useState, useReducer, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@apollo/client'
import cn from 'classnames'
import moment from 'moment'
import { useHistory } from 'react-router'
import axios from 'axios'

import {
  CHECK_COMMITMENT,
  GET_MINIMUM_COMMITMENT_AGE,
  GET_MAXIMUM_COMMITMENT_AGE,
  GET_RENT_PRICE,
  WAIT_BLOCK_TIMESTAMP,
  GET_BALANCE,
  GET_ETH_PRICE,
  GET_PRICE_CURVE
} from 'graphql/queries'
import { useInterval, useGasPrice, useBlock } from 'components/hooks'
import { useAccount } from '../../QueryAccount'
import { registerMachine, registerReducer } from './registerReducer'
import {
  startRegistering,
  errorRegistering,
  successRegistering
} from 'app/slices/registerSlice'
import { calculateDuration, yearInSeconds } from 'utils/dates'

import Loader from 'components/Loader'
import CTA from './CTA'
import NotAvailable from './NotAvailable'
import Pricer from '../Pricer'
import ProgressRecorder from './ProgressRecorder'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'
import { sendNotification } from './notification'
import PremiumPriceOracle from './PremiumPriceOracle'

import EditIcon from 'components/Icons/EditIcon'
import SuccessfulTickIcon from 'components/Icons/SuccessfulTickIcon'
import FailedIcon from 'components/Icons/FailedIcon'
import AnimationSpin from 'components/AnimationSpin'

const NameRegister = ({
  domain,
  waitTime,
  refetch,
  refetchIsMigrated,
  readOnly,
  registrationOpen
}) => {
  const { t } = useTranslation()
  const [secret, setSecret] = useState(false)
  const { networkId } = useNetworkInfo()
  const dispatchSlice = useDispatch()
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  const [customStep, setCustomStep] = useState('START')
  let now, currentPremium, underPremium
  const incrementStep = () => dispatch('NEXT')
  const decrementStep = () => dispatch('PREVIOUS')
  const [years, setYears] = useState(false)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [commitmentTimerRunning, setCommitmentTimerRunning] = useState(false)
  const [blockCreatedAt, setBlockCreatedAt] = useState(null)
  const [waitUntil, setWaitUntil] = useState(null)
  const [targetDate, setTargetDate] = useState(false)
  const [targetPremium, setTargetPremium] = useState(false)
  const [commitmentExpirationDate, setCommitmentExpirationDate] = useState(
    false
  )
  const [signature, setSignature] = useState('')
  const {
    data: { getEthPrice: ethUsdPrice } = {},
    loading: ethUsdPriceLoading
  } = useQuery(GET_ETH_PRICE)
  const { data: { getPriceCurve } = {} } = useQuery(GET_PRICE_CURVE)
  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice()
  const { block } = useBlock()
  const { data: { waitBlockTimestamp } = {} } = useQuery(WAIT_BLOCK_TIMESTAMP, {
    variables: {
      waitUntil
    },
    fetchPolicy: 'no-cache'
  })

  const history = useHistory()

  const account = useAccount()

  useEffect(() => {
    const fetchSignature = async () => {
      const params = {
        name: domain.label,
        owner: account,
        duration: calculateDuration(years),
        resolver: '0x47B4b2cB3e62712b9bb2981827b82EB6630c9076', // FIXME this is not fixed
        addr: account, //Eth wallet of user connected with metamask
        ChainID: 97
      }
      const result = await axios.post(
        'https://space-id-348516.uw.r.appspot.com/sign',
        params
      )
      if (result?.data?.signature) {
        setSignature(result.data.signature)
      }
    }
    fetchSignature()
  }, [years])

  const { data: { getBalance } = {} } = useQuery(GET_BALANCE, {
    variables: { address: account },
    fetchPolicy: 'no-cache'
  })

  const { data: { getMaximumCommitmentAge } = {} } = useQuery(
    GET_MAXIMUM_COMMITMENT_AGE,
    {
      fetchPolicy: 'no-cache'
    }
  )
  if (block) {
    now = moment(block.timestamp * 1000)
  }
  if (!commitmentExpirationDate && getMaximumCommitmentAge && blockCreatedAt) {
    setCommitmentExpirationDate(
      moment(blockCreatedAt).add(getMaximumCommitmentAge, 'second')
    )
  }
  const { data: { checkCommitment = false } = {} } = useQuery(
    CHECK_COMMITMENT,
    {
      variables: {
        label: domain.label,
        secret,
        // Add this varialbe so that it keeps polling only during the timer is on
        commitmentTimerRunning
      },
      fetchPolicy: 'no-cache'
    }
  )

  ProgressRecorder({
    checkCommitment,
    domain,
    networkId,
    states: registerMachine.states,
    dispatch,
    step,
    secret,
    setSecret,
    years,
    setYears,
    timerRunning,
    setTimerRunning,
    waitUntil,
    setWaitUntil,
    secondsPassed,
    setSecondsPassed,
    commitmentExpirationDate,
    setCommitmentExpirationDate,
    now
  })
  useInterval(
    () => {
      if (blockCreatedAt && !waitUntil) {
        setWaitUntil(blockCreatedAt + waitTime * 1000)
      }
      if (secondsPassed < waitTime) {
        setSecondsPassed(s => s + 1)
      } else {
        if (waitBlockTimestamp && timerRunning) {
          incrementStep()
          sendNotification(
            `${domain.name} ${t('register.notifications.ready')}`
          )
        }
        setTimerRunning(false)
      }
    },
    timerRunning ? 1000 : null
  )
  useInterval(
    () => {
      if (checkCommitment > 0) {
        incrementStep()
        setTimerRunning(true)
        setCommitmentTimerRunning(false)
      } else {
        setCommitmentTimerRunning(new Date())
      }
    },
    commitmentTimerRunning ? 1000 : null
  )
  const parsedYears = parseFloat(years)
  const duration = calculateDuration(years)
  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: domain.label,
        commitmentTimerRunning
      }
    }
  )
  const {
    data: { getRentPrice: getPremiumPrice } = {},
    loading: getPremiumPriceLoading
  } = useQuery(GET_RENT_PRICE, {
    variables: {
      duration: 0,
      label: domain.label,
      commitmentTimerRunning
    }
  })

  let hasSufficientBalance
  if (!blockCreatedAt && checkCommitment > 0) {
    setBlockCreatedAt(checkCommitment * 1000)
  }
  if (getBalance && getRentPrice) {
    hasSufficientBalance = getBalance.gt(getRentPrice)
  }
  if (blockCreatedAt && !waitUntil) {
    setWaitUntil(blockCreatedAt + waitTime * 1000)
  }

  const oneMonthInSeconds = 2419200
  const twentyEightDaysInYears = oneMonthInSeconds / yearInSeconds
  const isAboveMinDuration = parsedYears > twentyEightDaysInYears

  const expiryDate = moment(domain.expiryTime)
  const oracle = new PremiumPriceOracle(expiryDate, getPriceCurve)
  const { releasedDate, zeroPremiumDate } = oracle

  if (!registrationOpen) return <NotAvailable domain={domain} />

  if (ethUsdPriceLoading || gasPriceLoading)
    return <Loader withWrap={true} large />

  if (!targetDate) {
    setTargetDate(zeroPremiumDate)
    setTargetPremium(
      oracle.getTargetAmountByDaysPast(oracle.getDaysPast(zeroPremiumDate))
    )
  }

  if (block) {
    currentPremium = oracle.getTargetAmountByDaysPast(oracle.getDaysPast(now))
    underPremium = now.isBetween(releasedDate, zeroPremiumDate)
  }

  const successRegister = () => {
    dispatchSlice(successRegistering())
    setCustomStep('SUCCESS')
  }

  const manageProfile = () => history.push('/profile')

  return (
    <div className="max-w-[448px] mx-auto pb-[40px]">
      <div className="flex justify-center">
        <p className="min-w-full max-w-full block text-ellipsis overflow-hidden break-words font-bold text-[28px] text-[#1EEFA4] py-2 border-[4px] border-[#1EEFA4] rounded-[22px] text-center max-w-max px-6">
          {domain.name}
        </p>
      </div>

      {/* Register Process Screen if the user doesn't have any domain */}
      {customStep === 'START' && (
        <div>
          <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 mt-8">
            {step === 'AWAITING_REGISTER' && (
              <Pricer
                name={domain.label}
                duration={duration}
                years={years}
                setYears={setYears}
                ethUsdPriceLoading={ethUsdPriceLoading}
                ethUsdPremiumPrice={currentPremium}
                ethUsdPrice={ethUsdPrice}
                gasPrice={gasPrice}
                loading={rentPriceLoading}
                price={getRentPrice}
                premiumOnlyPrice={getPremiumPrice}
                underPremium={underPremium}
                displayGas={true}
              />
            )}
          </div>
          <CTA
            setCustomStep={setCustomStep}
            signature={signature}
            hasSufficientBalance={hasSufficientBalance}
            waitTime={waitTime}
            incrementStep={incrementStep}
            decrementStep={decrementStep}
            secret={secret}
            step={step}
            label={domain.label}
            duration={duration}
            secondsPassed={secondsPassed}
            timerRunning={timerRunning}
            setTimerRunning={setTimerRunning}
            setCommitmentTimerRunning={setCommitmentTimerRunning}
            commitmentTimerRunning={commitmentTimerRunning}
            setBlockCreatedAt={setBlockCreatedAt}
            refetch={refetch}
            refetchIsMigrated={refetchIsMigrated}
            isAboveMinDuration={isAboveMinDuration}
            readOnly={readOnly}
            price={getRentPrice}
            years={years}
            premium={currentPremium}
            ethUsdPrice={!ethUsdPriceLoading && ethUsdPrice}
            successRegister={successRegister}
          />
        </div>
      )}

      {(customStep === 'SUCCESS' ||
        customStep === 'PENDING' ||
        customStep === 'ERROR') && (
        <div className="max-w-[436px]">
          <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 mt-8">
            <div className="flex justify-center">
              <EditIcon />
            </div>
            {customStep === 'PENDING' ? (
              <div className="font-semibold text-[24px] text-white text-center mt-2">
                Registration in progress...
              </div>
            ) : (
              <div className="font-semibold text-[24px] text-white text-center mt-2">
                Registration completed!
              </div>
            )}

            <div className="text-[14px] text-[#BDCED1] leading-[22px] text-center">
              Please be patient as the process might take a few minutes. You may
              click <span className="text-[#ED7E18]">here</span> to learn more
              about the registration process.
            </div>
            <div className="mt-8">
              <div className="text-center">
                <div
                  className={cn(
                    customStep === 'ERROR'
                      ? 'text-[#ED7E17]'
                      : 'text-[#30DB9E]',
                    'font-semibold text-[16px]'
                  )}
                >
                  Confirm Payment
                </div>
                {customStep === 'PENDING' ? (
                  <AnimationSpin className="flex justify-center mt-1" />
                ) : (
                  <div>
                    {customStep === 'ERROR' ? (
                      <FailedIcon className="text-[#ED7E17] flex justify-center my-2" />
                    ) : (
                      <SuccessfulTickIcon className="text-[#30DB9E] flex justify-center my-2" />
                    )}
                  </div>
                )}
              </div>
              <div className="text-center mt-1">
                <div
                  className={cn(
                    'font-semibold text-[16px]',
                    customStep === 'PENDING'
                      ? 'text-[#7E9195]'
                      : customStep === 'ERROR'
                      ? 'text-[#ED7E17]'
                      : 'text-[#30DB9E]'
                  )}
                >
                  Successful registration. Name published
                </div>
                {customStep === 'PENDING' ? (
                  <AnimationSpin className="flex justify-center mt-1" />
                ) : (
                  <div>
                    {customStep === 'ERROR' ? (
                      <FailedIcon className="text-[#ED7E17] flex justify-center my-2" />
                    ) : (
                      <SuccessfulTickIcon className="text-[#30DB9E] flex justify-center my-2" />
                    )}
                  </div>
                )}
              </div>
            </div>
            {customStep === 'ERROR' && (
              <div className="text-[#BDCED1] text-[16px] text-center mt-8">
                Something went wrong in the registration process. You may choose
                to retry and be redirected back to the payment review page.
              </div>
            )}

            {customStep === 'ERROR' ? (
              <div className="flex justify-center mt-10">
                <button
                  className={cn(
                    'py-2 border rounded-[16px] text-[#071A2F] font-semibold bg-[#30DB9E] border-0 px-[30px]'
                  )}
                  onClick={() => setCustomStep('START')}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="flex justify-center mt-10">
                <button
                  className={cn(
                    'py-2 border rounded-[16px] text-[#071A2F] font-semibold bg-[#30DB9E] border-0 px-[30px]'
                  )}
                  onClick={() => manageProfile()}
                >
                  Manage Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const NameRegisterDataWrapper = props => {
  const { data, loading, error } = useQuery(GET_MINIMUM_COMMITMENT_AGE)

  if (loading) return <Loader withWrap={true} large />
  if (error) {
    console.log(error)
  }
  return <NameRegister waitTime={data?.getMinimumCommitmentAge} {...props} />
}

export default NameRegisterDataWrapper
