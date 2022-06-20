//Import packages
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

//Import components
import AddressList from './AddressList'
import MainBoard from './MainBoard'
import AnimationSpin from 'components/AnimationSpin'
import EditButton from '../../../../components/Button/EditButton'
import TopAddress from './TopAddress'

//Import sdk objects
import getENS, { getRegistrar } from 'apollo/mutations/ens'

//Import Reducer
import { toggleEditMode } from 'app/slices/accountSlice'

export default function Mainbar({
  sid,
  selectedDomain,
  isAccountConnected,
  account
}) {
  const editOn = useSelector(state => state.account.profileEditMode)
  const [loading, setLoading] = useState(true)
  const [loadingRegistration, setLoadingRegistration] = useState(true)
  const [registrantAddress, setRegistrantAddress] = useState('')
  const [resolverAddress, setResolverAddress] = useState('')
  const [loadingResolverAddress, setLoadingResolverAddress] = useState(true)
  const dispatch = useDispatch()

  const toggleOn = param => {
    dispatch(toggleEditMode(param))
  }

  const fetchRegistrantAddress = async () => {
    const t_address = await refetchRegistrantAddress()
    setRegistrantAddress(t_address)
    if (t_address === account) setIsRegsitrant(true)
    setLoadingRegistration(false)
  }

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
      console.log(err)
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

  if (loading) {
    return (
      <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-5 relative min-w-[840px] flex justify-center items-center">
        <AnimationSpin size={60} />
      </div>
    )
  }

  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-[40px] relative">
      {/* {selectedDomain && (
        <div className="text-center">
          <div className="text-[#1EEFA4] text-[32px] font-bold">
            {selectedDomain?.name}.bnb
          </div>
          <div className="text-white text-urbanist font-semibold text-[14px]">
            Expiration Date:{' '}
            {moment(
              selectedDomain?.expires_at.split(',')[0].replaceAll('.', '-')
            ).format('YYYY-MM-DD hh:mm')}
          </div>
        </div>
      )} */}
      {/* {isAccountConnected && (
        <EditButton
          className="absolute top-[20px] right-[20px]"
          isON={editOn}
          handleClick={toggleOn}
        />
      )} */}

      {/* <AddressList
        className="mt-[14px]"
        sid={sid}
        selectedDomain={selectedDomain}
        canEdit={editOn}
        account={account}
      /> */}
      {selectedDomain && (
        <TopAddress
          className="pb-8 border-b border-[rgba(204,252,255,0.2)]"
          selectedDomain={selectedDomain}
          registrantAddress={registrantAddress}
          loadingRegistration={loadingRegistration}
        />
      )}

      {selectedDomain && (
        <MainBoard
          selectedDomain={{ ...selectedDomain }}
          className="mt-8"
          resolverAddress={resolverAddress}
          loadingResolverAddress={loadingResolverAddress}
        />
      )}
    </div>
  )
}
