//Import packages
import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import moment from 'moment'

//Import components
import MainBoard from './MainBoard'
import AnimationSpin from 'components/AnimationSpin'
import TopAddress from './TopAddress'
import TransferAddressModal from 'components/Modal/TransferAddressModal'
import ExtendPeriodModal from 'components/Modal/ExtendPeriodModal'

//Import sdk objects
import { getRegistrar } from 'apollo/mutations/ens'

//Import graphql quires
import { SET_REGISTRANT, SET_RESOLVER, RENEW } from 'graphql/mutations'
import { GET_ETH_PRICE, GET_RENT_PRICE, GET_PRICE_CURVE } from 'graphql/queries'

//Import custom hooks
import { useEditable } from 'components/hooks'
import { useInterval, useGasPrice, useBlock } from 'components/hooks'

// Import custom functions
import { calculateDuration } from 'utils/dates'
import PremiumPriceOracle from 'components/SingleName/NameRegister/PremiumPriceOracle'

export default function Mainbar({ sid, selectedDomain, account, isReadOnly }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingRegistration, setLoadingRegistration] = useState(true)
  const [registrantAddress, setRegistrantAddress] = useState('')
  const [resolverAddress, setResolverAddress] = useState('')
  const [loadingResolverAddress, setLoadingResolverAddress] = useState(true)
  const [transferShowModal, setTransferShowModal] = useState(false)
  const [extendPeriodShowModal, setExtendPeriodShowModal] = useState(false)
  const [mutationQuery, setMutationQuery] = useState(null)
  const [isRegsitrant, setIsRegsitrant] = useState(false)

  const [years, setYears] = useState(1)

  let now, currentPremium, underPremium

  const duration = calculateDuration(years)

  const expirationDate = new Date(
    new Date(registrantAddress).getTime() + duration * 1000
  )

  const { state, actions } = useEditable()
  const { editing, txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions

  const { block } = useBlock()

  const [mutation] = useMutation(mutationQuery ?? SET_REGISTRANT, {
    onCompleted: data => {
      const txHash = Object.values(data)[0]
      startPending(txHash)
    }
  })

  const {
    data: { getRentPrice: getPremiumPrice } = {},
    loading: getPremiumPriceLoading
  } = useQuery(GET_RENT_PRICE, {
    variables: {
      duration: 0,
      label: selectedDomain?.name,
      commitmentTimerRunning: false
    }
  })

  const [
    loadEthUSDPriceData,
    { loading: ethUsdPriceLoading, data: ethUsdPriceData = {} }
  ] = useLazyQuery(GET_ETH_PRICE)

  // const { data: ethUsdPriceData = {}, loading: ethUsdPriceLoading } = useQuery(
  //   GET_ETH_PRICE
  // )

  const { data: { getPriceCurve } = {} } = useQuery(GET_PRICE_CURVE)

  let ethUsdPrice = ethUsdPriceData?.getEthPrice ?? 0

  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: selectedDomain?.name
      }
    }
  )

  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice(
    true,
    isReadOnly
  )

  const expiryDate = moment(selectedDomain?.expires_at)

  const oracle = new PremiumPriceOracle(expiryDate, getPriceCurve)
  const { releasedDate, zeroPremiumDate } = oracle

  if (block) {
    now = moment(block.timestamp * 1000)
  }

  if (block) {
    currentPremium = oracle.getTargetAmountByDaysPast(oracle.getDaysPast(now))
    underPremium = now.isBetween(releasedDate, zeroPremiumDate)
  }

  const fetchRegistrantAddress = async () => {
    const t_address = await refetchRegistrantAddress()
    setRegistrantAddress(t_address)
    if (t_address === account) setIsRegsitrant(true)
    setLoadingRegistration(false)
  }

  useEffect(() => {
    setIsRegsitrant(registrantAddress === account)
  }, [registrantAddress])

  useEffect(() => {
    loadEthUSDPriceData()
  }, [isReadOnly])

  const refetchRegistrantAddress = async () => {
    const registrar = getRegistrar()
    const entry = await registrar.getEntry(selectedDomain.name)
    return entry.registrant
  }

  const refetchResolverAddress = async () => {
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const resolver = await nameUI.getResolver()
    return resolver
  }

  const fetchResolverAddress = async () => {
    try {
      const t_address = await refetchResolverAddress()
      setResolverAddress(t_address)
      setLoadingResolverAddress(false)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (sid && selectedDomain) {
      setLoading(false)
      setLoadingRegistration(true)
      setLoadingResolverAddress(true)
      fetchRegistrantAddress()
      fetchResolverAddress()
    }
  }, [sid, selectedDomain])

  const transferAddress = values => {
    setTransferShowModal(false)
    if (title === 'Registrant') {
      const variables = {
        address: values.address,
        name: selectedDomain.name + '.bnb'
      }
      setMutationQuery(SET_REGISTRANT)
      mutation({
        variables
      })
    } else {
      setMutationQuery(SET_RESOLVER)

      var variables = {
        address: values.address,
        name: selectedDomain.name + '.bnb'
      }
      mutation({ variables })
    }
  }

  const extendExpiryDate = () => {
    const variables = {
      duration,
      label: selectedDomain.name
    }
    setMutationQuery(RENEW)
    mutation({ variables })
  }

  if (loading) {
    return (
      <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-5 relative min-w-[840px] flex justify-center items-center">
        <AnimationSpin size={60} />
      </div>
    )
  }

  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-[40px] relative w-[962px]">
      {selectedDomain && (
        <TopAddress
          isRegsitrant={isRegsitrant}
          className="pb-8 border-b border-[rgba(204,252,255,0.2)]"
          selectedDomain={selectedDomain}
          registrantAddress={registrantAddress}
          loadingRegistration={loadingRegistration}
          transferRegistrantAddress={() => {
            setTitle('Registrant')
            setTransferShowModal(true)
          }}
          pending={
            editing ? null : pending && !confirmed && title === 'Registrant'
          }
          pendingExpirationDate={
            editing
              ? null
              : pending && !confirmed && title === 'Expiration Date'
          }
          setConfirmed={setConfirmed}
          refetchAddress={refetchRegistrantAddress}
          fetchAddress={fetchRegistrantAddress}
          txHash={txHash}
          address={registrantAddress}
          extendHandler={() => {
            setTitle('Expiration Date')
            setExtendPeriodShowModal(true)
          }}
        />
      )}

      {selectedDomain && (
        <MainBoard
          selectedDomain={{ ...selectedDomain }}
          className="mt-8"
          resolverAddress={resolverAddress}
          loadingResolverAddress={loadingResolverAddress}
          setResolver={() => {
            setTitle('Resolver')
            setTransferShowModal(true)
          }}
          pending={
            editing ? null : pending && !confirmed && title === 'Resolver'
          }
          setConfirmed={setConfirmed}
          refetchAddress={refetchResolverAddress}
          fetchAddress={fetchResolverAddress}
          txHash={txHash}
          address={resolverAddress}
        />
      )}
      <TransferAddressModal
        title={title}
        show={transferShowModal}
        saveHandler={transferAddress}
        account={account}
        closeModal={() => setTransferShowModal(false)}
        address={title === 'Registrant' ? registrantAddress : resolverAddress}
      />
      <ExtendPeriodModal
        show={extendPeriodShowModal}
        selectedDomain={selectedDomain}
        duration={duration}
        years={years}
        setYears={years => {
          setYears(years)
          // updateValue(formatDate(expirationDate))
        }}
        ethUsdPriceLoading={ethUsdPriceLoading}
        ethUsdPrice={ethUsdPrice}
        price={getRentPrice}
        rentPriceLoading={rentPriceLoading}
        gasPrice={gasPrice}
        ethUsdPremiumPrice={currentPremium}
        premiumOnlyPrice={getPremiumPrice}
        underPremium={underPremium}
        displayGas={true}
        closeModal={() => setExtendPeriodShowModal(false)}
        extendHandler={extendExpiryDate}
      />
    </div>
  )
}
