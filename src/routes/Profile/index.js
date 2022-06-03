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
      const account = await getAccount()
      console.log('account', account)
      const infura = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
      const provider = new ethers.providers.JsonRpcProvider(infura)
      const tSid = new SID({ provider, sidAddress: getSidAddress(networkId) })
      setSid(tSid)
      // const address = await sid.name('test.bnb').getAddress() // 0x123
      // console.log(`address of ${name} is ${address}`)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="mt-[40px]">
      <div className="flex">
        {/* SideBar Component */}
        <Sidebar className="mr-[32px]" />
        <Mainbar sid={sid} selectedDomain={selectedDomain} />
      </div>

      {haveNoPermissionToEdit && <NoPermissionEdit />}
    </div>
  )
}
