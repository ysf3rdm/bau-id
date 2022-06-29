// Import packages
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, gql } from '@apollo/client'
import SID, { getSidAddress } from '@siddomains/sidjs'
import { ethers } from '@siddomains/ui'
import { getNetworkId, getAccount } from '@siddomains/ui'

// Import components
import { NoPermissionEdit } from 'components/ErrorModals'
import { useAccount } from 'components/QueryAccount'
import Mainbar from './components/Mainbar'
import Sidebar from './components/Sidebar'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export default function Profile() {
  const haveNoPermissionToEdit = false
  const [sid, setSid] = useState(null)
  const [isAccountConnected, setIsAccountConnected] = useState(false)
  const [networkId, setNetworkId] = useState('')

  const account = useAccount()
  const selectedDomain = useSelector(state => state.domain.selectedDomain)

  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: account
    }
  })

  const { displayName, isReadOnly, isSafeApp, network } = data

  useEffect(() => {
    const tAccountConnected =
      account !== '0x0000000000000000000000000000000000000000'
    setIsAccountConnected(tAccountConnected)
    if (tAccountConnected) {
      sidSetup()
    }
  }, [account])

  const sidSetup = async () => {
    try {
      const networkId = await getNetworkId()
      setNetworkId(networkId)
      const infura =
        'https://apis-sj.ankr.com/bc19fe97c68d4a99a059465623e46b3e/bb63faaa8f178d26aac2969443ec7e73/binance/full/test'
      const provider = new ethers.providers.JsonRpcProvider(infura)
      const tSid = new SID({ provider, sidAddress: getSidAddress(networkId) })
      setSid(tSid)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="mt-[10px] pb-[54px]">
      <div className="flex justify-center">
        <Sidebar
          className="mr-[32px]"
          isReadOnly={isReadOnly}
          displayName={displayName}
          isSafeApp={isSafeApp}
          network={network}
        />
        <Mainbar
          isAccountConnected={isAccountConnected}
          sid={sid}
          selectedDomain={selectedDomain}
          account={account}
          isReadOnly={isReadOnly}
          networkId={networkId}
        />
      </div>
      {haveNoPermissionToEdit && <NoPermissionEdit />}
    </div>
  )
}
