import React, { useState, useEffect, useCallback } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import { toArray, last } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import EthVal from 'ethval'

import {
  CHECK_COMMITMENT,
  GET_MINIMUM_COMMITMENT_AGE,
  GET_MAXIMUM_COMMITMENT_AGE,
  GET_RENT_PRICE,
  WAIT_BLOCK_TIMESTAMP,
  GET_BALANCE,
  GET_ETH_PRICE,
  GET_PRICE_CURVE,
  GET_RENT_PRICE_WITH_POINT,
} from 'graphql/queries'
import { useInterval, useGasPrice, useBlock } from 'components/hooks'
import { useAccount } from '../../QueryAccount'
import { calculateDuration, yearInSeconds } from 'utils/dates'
import { GET_TRANSACTION_HISTORY } from 'graphql/queries'

import { setShowWalletModal } from 'app/slices/uiSlice'

import Loader from 'components/Loader'
import NotAvailable from './NotAvailable'
import ProgressRecorder from './ProgressRecorder'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'
import PremiumPriceOracle from './PremiumPriceOracle'

import AnimationSpin from 'components/AnimationSpin'
import Step2Sidebar from './step2Sidebar'
import Step1Sidebar from './step1Sidebar'
import Step1Main from './step1Main'
import Step2Main from './step2Main'
import RegisterProgress from './registerProgress'
import { REGISTER, COMMIT } from '../../../graphql/mutations'
import { TOGAL_GAS_WEI } from '../../../constants/gas'
import { minYear, RegisterState } from './constant'
import InsufficientBalanceModal from '../../Modal/InsufficientBalanceModal'

const NameRegister = ({ domain, waitTime, registrationOpen }) => {
  const [secret, setSecret] = useState(false)
  const { networkId } = useNetworkInfo()
  const account = useAccount()
  const dispatch = useDispatch()
  const [registerState, setRegisterState] = useState(RegisterState.request)
  let now, currentPremium, underPremium
  const [years, setYears] = useState(minYear)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [commitmentTimerRunning, setCommitmentTimerRunning] = useState(false)
  const [blockCreatedAt, setBlockCreatedAt] = useState(null)
  const [waitUntil, setWaitUntil] = useState(null)
  const [targetDate, setTargetDate] = useState(false)
  const [commitmentExpirationDate, setCommitmentExpirationDate] =
    useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [showInsufficientModal, setShowInsufficientModal] = useState(false)
  const [signature, setSignature] = useState([])
  const [usePoint, setUsePoint] = useState(undefined)
  const [nameArr, setNameArr] = useState([])
  const inviter = useSelector((state) => state.referral.inviter)
  const [savedInviter, setSavedInviter] = useState('')

  const handleYearChange = useCallback((v) => {
    const n = Number(v)
    if (Number.isNaN(n) || n < minYear) {
      setYears(minYear)
    } else {
      setYears(n)
    }
  }, [])

  // get eth price
  const {
    data: { getEthPrice: ethUsdPrice } = {},
    loading: ethUsdPriceLoading,
  } = useQuery(GET_ETH_PRICE)

  // get price curve
  const { data: { getPriceCurve } = {} } = useQuery(GET_PRICE_CURVE)
  // get gas price
  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice()
  // latest block
  const { block } = useBlock()
  // wait block timestamp
  const { data: { waitBlockTimestamp } = {} } = useQuery(WAIT_BLOCK_TIMESTAMP, {
    variables: {
      waitUntil,
    },
    fetchPolicy: 'no-cache',
  })
  // get transaction history
  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )
  // last transaction
  const lastTransaction = last(transactionHistory)

  // commit domain
  const [mutationCommit] = useMutation(COMMIT, {
    onCompleted: (data) => {
      if (data?.commit) {
        setCommitmentTimerRunning(true)
      } else {
        setRegisterState(RegisterState.request)
      }
    },
    onError: (error) => {
      console.error(error)
      setRegisterState(RegisterState.request)
    },
  })
  // register domain
  const [mutationRegister] = useMutation(REGISTER, {
    onCompleted: (data) => {
      if (data?.register) {
        setTransactionHash(data.register)
      } else {
        setRegisterState(RegisterState.registerError)
      }
    },
    onError: (error) => {
      console.error(error)
      setRegisterState(RegisterState.registerError)
    },
  })
  useEffect(() => {
    const temp = toArray(domain?.name ?? '')
    if (window.innerWidth >= 768 && temp.length > 33) {
      temp.splice(15, temp.length - 33, ['...'])
    } else if (temp.length > 16) {
      temp.splice(7, temp.length - 16, ['..'])
    }
    setNameArr(temp)
  }, [])

  // check transaction
  useEffect(() => {
    if (
      lastTransaction &&
      lastTransaction.txHash === transactionHash &&
      lastTransaction.txState === 'Confirmed'
    ) {
      setRegisterState(RegisterState.registerSuccess)
    }
    if (
      lastTransaction &&
      lastTransaction.txHash === transactionHash &&
      lastTransaction.txState === 'Error'
    ) {
      setRegisterState(RegisterState.registerError)
    }
  }, [transactionHistory])

  // get balance
  const { data: { getBalance } = {} } = useQuery(GET_BALANCE, {
    variables: { address: account },
    fetchPolicy: 'no-cache',
  })
  // get max commitment age
  const { data: { getMaximumCommitmentAge } = {} } = useQuery(
    GET_MAXIMUM_COMMITMENT_AGE,
    {
      fetchPolicy: 'no-cache',
    }
  )

  if (block) {
    // latest bock time
    now = moment(block.timestamp * 1000)
  }

  // commit expiration date
  if (!commitmentExpirationDate && getMaximumCommitmentAge && blockCreatedAt) {
    setCommitmentExpirationDate(
      moment(blockCreatedAt).add(getMaximumCommitmentAge, 'second')
    )
  }
  // check commit
  const { data: { checkCommitment = false } = {} } = useQuery(
    CHECK_COMMITMENT,
    {
      variables: {
        label: domain.label,
        secret,
        commitmentTimerRunning,
      },
      fetchPolicy: 'no-cache',
    }
  )

  ProgressRecorder({
    checkCommitment,
    domain,
    networkId,
    states: RegisterState,
    dispatch: setRegisterState,
    step: registerState,
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
    now,
    usePoint,
    setUsePoint,
    inviter,
    savedInviter,
    setSavedInviter,
  })

  useInterval(
    () => {
      if (blockCreatedAt && !waitUntil) {
        setWaitUntil(blockCreatedAt + waitTime * 1000)
      }
      if (secondsPassed < waitTime) {
        setSecondsPassed((s) => s + 1)
      } else {
        if (waitBlockTimestamp && timerRunning) {
          // confirm
          setRegisterState(RegisterState.confirm)
        }
        setTimerRunning(false)
      }
    },
    timerRunning ? 1000 : null
  )
  useInterval(
    () => {
      if (checkCommitment > 0) {
        // incrementStep() todo: confirm?
        setRegisterState(RegisterState.requestSuccess)
        setTimerRunning(true) // start confirm timer
        setCommitmentTimerRunning(false)
      } else {
        setCommitmentTimerRunning(new Date()) // force refresh?
      }
    },
    commitmentTimerRunning ? 1000 : null
  )

  const duration = calculateDuration(years)

  // rent price
  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: domain.label,
        commitmentTimerRunning,
      },
    }
  )
  // rent price with point
  const {
    data: { getRentPriceWithPoint } = {},
    loading: rentPriceWithPointLoading,
    refetch: refetchRentPriceWithPoint,
  } = useQuery(GET_RENT_PRICE_WITH_POINT, {
    variables: {
      duration,
      label: domain.label,
      account,
      commitmentTimerRunning,
    },
  })
  // rent price duration 0
  const {
    data: { getRentPrice: getPremiumPrice } = {},
    loading: getPremiumPriceLoading,
  } = useQuery(GET_RENT_PRICE, {
    variables: {
      duration: 0,
      label: domain.label,
      commitmentTimerRunning,
    },
  })
  const ethVal = new EthVal(`${getRentPrice || 0}`).toEth()
  const ethValWithPoint = new EthVal(
    `${getRentPriceWithPoint || getRentPrice || 0}`
  ).toEth()
  const registerGasFast = new EthVal(`${TOGAL_GAS_WEI * gasPrice.fast}`).toEth()
  const registrationFee = ethVal.add(registerGasFast)
  const registrationFeeWithPoint = ethValWithPoint.add(registerGasFast)
  const registrationFeeInUsd = registrationFee.mul(ethUsdPrice ?? 0)
  const registrationFeeWithPointInUsd = registrationFeeWithPoint.mul(
    ethUsdPrice ?? 0
  )

  let hasSufficientBalance
  if (!blockCreatedAt && checkCommitment > 0) {
    setBlockCreatedAt(checkCommitment * 1000)
  }
  if (getBalance && getRentPrice && getRentPriceWithPoint) {
    hasSufficientBalance = getBalance.gt(
      usePoint ? getRentPriceWithPoint : getRentPrice
    )
  }
  if (blockCreatedAt && !waitUntil) {
    setWaitUntil(blockCreatedAt + waitTime * 1000)
  }

  const oneMonthInSeconds = 2419200
  const twentyEightDaysInYears = oneMonthInSeconds / yearInSeconds

  const expiryDate = moment(domain.expiryTime)
  const oracle = new PremiumPriceOracle(expiryDate, getPriceCurve)
  const { releasedDate, zeroPremiumDate } = oracle

  if (!registrationOpen) return <NotAvailable domain={domain} />

  if (ethUsdPriceLoading || gasPriceLoading) {
    return <Loader withWrap={true} large />
  }

  if (!targetDate) {
    setTargetDate(zeroPremiumDate)
  }

  if (block) {
    currentPremium = oracle.getTargetAmountByDaysPast(oracle.getDaysPast(now))
    underPremium = now.isBetween(releasedDate, zeroPremiumDate)
  }

  const refetchRent = () => {
    refetchRentPriceWithPoint()
  }

  const connectHandler = () => {
    dispatch(setShowWalletModal(true))
  }

  const handleRequest = (usePoint = false) => {
    if (!hasSufficientBalance) {
      setShowInsufficientModal(true)
      return
    }
    const variables = {
      label: domain.label,
      secret,
    }
    setRegisterState(RegisterState.requesting)
    mutationCommit({ variables })
  }
  const handleRetry = () => {
    setRegisterState(RegisterState.confirm)
  }
  const handleRegister = () => {
    if (!hasSufficientBalance) {
      setShowInsufficientModal(true)
      return
    }
    setRegisterState(RegisterState.registering)
    // dispatch(startRegistering())
    const variables = {
      label: domain.label,
      duration,
      secret,
      usePoint,
      inviter: savedInviter,
    }
    mutationRegister({ variables })
  }
  return (
    <>
      {showInsufficientModal && (
        <InsufficientBalanceModal
          closeModal={() => setShowInsufficientModal(false)}
        />
      )}
      <div className="flex flex-col items-center mx-auto space-y-3">
        <div className="flex justify-center">
          <p className="md:max-w-[928px] max-w-[360px] md:min-w-[320px] w-auto whitespace-nowrap overflow-hidden break-words font-bold text-xl md:text-[28px] text-green-100 py-2 border-4 border-green-100 rounded-[22px] text-center px-6">
            {nameArr.join('')}
          </p>
        </div>
        <div className="text-xl font-semibold text-green-600 max-w-full w-full overflow-hidden flex justify-center">
          {inviter || savedInviter ? (
            <>
              <span className="flex-shrink-0">- Invitation from&nbsp;</span>
              <span className="text-[#F1DD23] truncate sm:max-w-fit max-w-[232px]">{`${
                registerState === RegisterState.confirm ||
                registerState.startsWith(RegisterState.register)
                  ? savedInviter
                  : inviter ?? ''
              }`}</span>
              <span className="flex-shrink-0">&nbsp;-</span>
            </>
          ) : (
            <span className="select-none">&nbsp;</span>
          )}
        </div>
        <div className="flex flex-col 2md:flex-row">
          {(registerState === RegisterState.confirm ||
            registerState.startsWith(RegisterState.register)) && (
            <Step1Sidebar
              usePoint={usePoint}
              price={registrationFee}
              priceWithPoint={registrationFeeWithPoint}
              totalUsd={registrationFeeInUsd}
              totalUsdWithPoint={registrationFeeWithPointInUsd}
            />
          )}
          <div className="bg-fill-2 backdrop-blur-[5px] rounded-2xl 2md:px-[50px] p-6 space-y-6">
            {registerState.startsWith(RegisterState.request) && (
              <Step1Main
                usePoint={usePoint}
                setUsePoint={setUsePoint}
                state={registerState}
                duration={duration}
                years={years}
                setYears={handleYearChange}
                ethUsdPriceLoading={ethUsdPriceLoading}
                ethUsdPremiumPrice={currentPremium}
                ethUsdPrice={ethUsdPrice}
                loading={rentPriceLoading}
                price={getRentPrice}
                premiumOnlyPrice={getPremiumPrice}
                underPremium={underPremium}
                connectHandler={connectHandler}
                signature={signature}
                registerGasFast={registerGasFast}
                registrationFee={registrationFee}
                registrationFeeInUsd={registrationFeeInUsd}
                registrationFeeWithPoint={registrationFeeWithPoint}
                registrationFeeWithPointInUsd={registrationFeeWithPointInUsd}
                onRequest={handleRequest}
                refetchRent={refetchRent}
              />
            )}
            {(registerState === RegisterState.confirm ||
              registerState.startsWith(RegisterState.register)) && (
              <Step2Main
                state={registerState}
                onRegister={handleRegister}
                onRetry={handleRetry}
                domain={domain}
              />
            )}
          </div>
          {registerState.startsWith(RegisterState.request) && <Step2Sidebar />}
        </div>
        <RegisterProgress state={registerState} />
      </div>
    </>
  )
}

const NameRegisterDataWrapper = (props) => {
  const { data, loading, error } = useQuery(GET_MINIMUM_COMMITMENT_AGE)
  if (loading) return <AnimationSpin size={40} />
  if (error) {
    console.error(error)
  }
  return <NameRegister waitTime={data?.getMinimumCommitmentAge} {...props} />
}

export default NameRegisterDataWrapper
