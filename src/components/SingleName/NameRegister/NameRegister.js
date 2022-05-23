import React, { useState, useReducer, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import moment from 'moment'
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
import { calculateDuration, yearInSeconds } from 'utils/dates'

import Loader from 'components/Loader'
import CTA from './CTA'
import NotAvailable from './NotAvailable'
import Pricer from '../Pricer'
import ProgressRecorder from './ProgressRecorder'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'
import { sendNotification } from './notification'
import PremiumPriceOracle from './PremiumPriceOracle'

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
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
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
  const account = useAccount()

  useEffect(() => {
    const fetchSignature = async () => {
      const params = {
        name: domain.label,
        owner: account,
        duration: calculateDuration(years),
        resolver: '0xf24DE185899Ac1cFee32970A490A4cCf721f7125', // Is it Fixed one
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
  }, [])

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

  if (ethUsdPriceLoading || gasPriceLoading) return <></>

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

  return (
    <div className="mt-[calc((100vh-625px)/2-44px)]">
      <div className="flex justify-center">
        <div className="font-bold text-[28px] text-[#1EEFA4] font-cocoSharp py-2 border-[4px] border-[#1EEFA4] rounded-[22px] text-center max-w-max px-[67px]">
          {domain.name}
        </div>
      </div>
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
      />
    </div>
  )
}

const NameRegisterDataWrapper = props => {
  const { data, loading, error } = useQuery(GET_MINIMUM_COMMITMENT_AGE)

  if (loading) return <Loader withWrap={true} large />
  if (error) {
    console.log(error)
  }
  const { getMinimumCommitmentAge } = data
  return <NameRegister waitTime={getMinimumCommitmentAge} {...props} />
}

export default NameRegisterDataWrapper
