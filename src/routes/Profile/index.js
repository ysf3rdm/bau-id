import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SID, { getSidAddress } from '@siddomains/sidjs'
import { ethers } from '@siddomains/ui'
import { getNetworkId, getAccount } from '@siddomains/ui'
import { NoPermissionEdit } from 'components/ErrorModals'
import { useAccount } from 'components/QueryAccount'
import Mainbar from './components/Mainbar'
import Sidebar from './components/Sidebar'

export default function Profile() {
  const haveNoPermissionToEdit = false
  const [sid, setSid] = useState(null)
  const account = useAccount()
  const selectedDomain = useSelector(state => state.domain.selectedDomain)

  useEffect(() => {
    if (account && account !== '0x0000000000000000000000000000000000000000') {
      sidSetup()
    }
  }, [account])

  const sidSetup = async () => {
    try {
      const networkId = await getNetworkId()
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
        {/* SideBar Component */}
        <Sidebar className="mr-[32px]" />
        <Mainbar sid={sid} selectedDomain={selectedDomain} />
      </div>
      {haveNoPermissionToEdit && <NoPermissionEdit />}
    </div>
  )
}
