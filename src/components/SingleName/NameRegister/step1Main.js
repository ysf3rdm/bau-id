import React, { useEffect, useState } from 'react'
import EthVal from 'ethval'
import { utils as ethersUtils } from 'ethers'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { setShowRedeem } from 'app/slices/giftCardSlice'
import CheckBox from 'components/CheckBox'
import Years from './Years'
import Price from './Price'
import { useQuery } from '@apollo/client'
import { HOME_DATA } from './CTA'
import { useAccount } from '../../QueryAccount'
import AnimationSpin from '../../AnimationSpin'
import { minYear, RegisterState } from './constant'
import CheckCircle from '../../Icons/CheckCircle'
import { QUERY_POINT_BALANCE } from '../../../graphql/queries'
import HelpInfo from '../../Icons/HelpInfo'
import Tooltip from '../../Tooltip/index'

import { useHistory } from 'react-router'
// Import redux assets
import { setToken } from 'app/slices/accountSlice'

const Step1Main = ({
  years,
  setYears,
  usePoint,
  setUsePoint,
  ethUsdPriceLoading,
  ethUsdPrice,
  ethUsdPremiumPrice,
  loading,
  price,
  premiumOnlyPrice,
  gasPrice,
  underPremium,
  connectHandler,
  onRequest,
  refetchRent,
  state,
  registrationFee,
  registrationFeeInUsd,
  registrationFeeWithPoint,
  registrationFeeWithPointInUsd,
  registerGasFast,
}) => {
  const history = useHistory()
  const moveToLogin = () => {
    history.push('/login')
  }
  const account = useAccount()
  const dispatch = useDispatch()
  const {
    data: { isReadOnly },
  } = useQuery(HOME_DATA, {
    variables: {
      address: account,
    },
  })

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated)

  const handleRequest = () => {
    onRequest()
  }
  const ethVal = new EthVal(`${price || 0}`).toEth()
  const { data: { getPointBalance = 0 } = {} } = useQuery(QUERY_POINT_BALANCE, {
    variables: { account },
    skip: !ethersUtils.isAddress(account),
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    refetchRent()
  }, [getPointBalance])

  return (
    <>
      <div className="flex flex-col font-semibold text-white">
        <div>
          <div className="font-bold text-center 2md:text-2xl text-xl">
            Step 1: Request to Register
          </div>
          <div className="mt-4 mb-[24px] flex flex-col space-y-3 2md:text-base text-sm font-semibold text-white">
            <div className="flex flex-col justify-center space-y-2 w-full">
              <div className="flex 2md:flex-row flex-col 2md:items-center justify-between 2md:space-x-6 2md:space-y-0 space-y-2">
                <div className="flex items-center justify-between flex-1 bg-fill-2 rounded-2xl px-4 py-1">
                  <span>Registration Year</span>
                  <Years
                    years={years}
                    setYears={setYears}
                    disable={state !== RegisterState.request}
                  />
                </div>
                <Price
                  className="w-[116px] text-right ml-auto 2md:pr-4 pr-2"
                  price={ethVal}
                  loading={loading}
                  ethUsdPrice={ethUsdPrice}
                />
              </div>
              {/* Gift Card */}
              {/* <div className="flex 2md:flex-row flex-col 2md:items-center justify-between 2md:space-x-6 2md:space-y-0 space-y-2">
                <div className="flex items-center justify-between flex-1 bg-fill-2 rounded-2xl px-4 py-1">
                  <div
                    className={cn(
                      'flex items-center space-x-2',
                      getPointBalance <= 0 ? 'text-gray-800' : ''
                    )}
                  >
                    <CheckBox
                      checked={usePoint}
                      onChange={setUsePoint}
                      disabled={
                        getPointBalance <= 0 || state !== RegisterState.request
                      }
                    />
                    <span>SID point</span>
                    <Tooltip
                      color="#2980E8"
                      side="bottom"
                      contentClass="rounded-xl p-2"
                      offset={10}
                      title={
                        <p className="text-sm text-white w-[280px] text-center">
                          SID Points are in-app credits which can be redeemed
                          from Gift Cards and be used to purchase domains.{' '}
                          <a
                            className="underline"
                            style={{ color: 'white' }}
                            href="https://docs.space.id/user-tutorials-for-.bnb-domain/how-to-use-space-id-gift-card"
                            target="_blank"
                          >
                            More details here
                          </a>
                        </p>
                      }
                    >
                      <HelpInfo className="text-green-600" />
                    </Tooltip>
                  </div>
                  <div className="flex justify-between space-x-3">
                    <span className="2md:text-sm text-xs text-green-600">
                      Balance: {getPointBalance}
                    </span>
                    <button
                      disabled={state !== RegisterState.request}
                      className="px-2 rounded-[10px] bg-fill-3 text-xs text-white font-semibold"
                      onClick={() => dispatch(setShowRedeem(true))}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
                <div className="w-[116px] text-right ml-auto 2md:pr-4 pr-2">
                  {usePoint &&
                    `- ${(registrationFee - registrationFeeWithPoint).toFixed(
                      3
                    )} BNB`}
                </div>
              </div> */}
              <div className="flex flex-row items-center justify-between 2md:px-4 px-2">
                <span className="font-normal">Estimated Gas Fee</span>
                <span className="w-[116px] text-right ml-auto">{`${registerGasFast.toFixed(
                  3
                )} BNB`}</span>
              </div>
            </div>
            <div className="divider 2md:pr-4 pr-0 s-divider s-divider-h"></div>
            <div className="flex items-center justify-between 2md:px-4 px-2 text-right">
              <span>Total</span>
              <div className="flex items-end text-xl font-bold 2md:space-x-4 space-x-2">
                <div className="font-normal text-sm text-green-600">
                  {`USD $${
                    usePoint
                      ? registrationFeeWithPointInUsd.toFixed(2)
                      : registrationFeeInUsd.toFixed(2)
                  }`}
                </div>
                <div className="divider divider-horizontal s-divider w-[1px] my-1"></div>
                <div className="text-primary">
                  {usePoint
                    ? registrationFeeWithPoint.toFixed(3)
                    : registrationFee.toFixed(3)}
                  BNB
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6 md:max-w-[640px] max-w-[312px]">
          <div className="text-center text-sm">
            In this step, you may request for registration and perform the first
            of the two transactions. Upon requesting, the system will undergo a
            process to ensure other users are not trying to register for the
            same domain and protect you after request. This may take up to 30
            seconds.
          </div>
          {isReadOnly && state === RegisterState.request && (
            <>
              <button
                className="btn-primary w-[160px] h-[42px] rounded-2xl text-lg font-semibold mx-auto"
                onClick={connectHandler}
              >
                Connect
              </button>
              <div className="font-semibold text-center text-sm text-red-100">
                *Please connect wallet to continue
              </div>
            </>
          )}
          {!isReadOnly && state === RegisterState.request && !isAuthenticated && (
            <button
              className={cn(
                'w-[160px] h-[42px] rounded-2xl text-lg font-semibold mx-auto mt-[24px]',
                isReadOnly || parseFloat(years) < minYear
                  ? 'bg-gray-800 text-white cursor-not-allowed'
                  : 'bg-green-200 text-dark-common'
              )}
              disabled={isReadOnly || parseFloat(years) < minYear}
              onClick={handleRequest}
            >
              Request
            </button>
          )}
          {isAuthenticated && (
            <>
              <button
                className="btn-primary w-[160px] h-[42px] rounded-2xl text-lg font-semibold mx-auto"
                onClick={moveToLogin}
              >
                Login
              </button>
              <div className="font-semibold text-center text-sm text-red-100">
                *Please login your account to continue
              </div>
            </>
          )}
          {state === RegisterState.requesting && (
            <div className="flex items-center mx-auto mt-[35px] ">
              <span className="text-green-100 text-lg font-semibold">
                TX Pending
              </span>
              <AnimationSpin className="ml-[10px]" size={20} />
            </div>
          )}
          {state === RegisterState.requestSuccess && (
            <CheckCircle className="flex items-center mx-auto mt-[32px] text-green-200" />
          )}
        </div>
      </div>
    </>
  )
}

export default Step1Main
