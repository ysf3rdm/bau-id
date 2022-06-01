import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import axios from 'axios'
import { useAccount } from 'components/QueryAccount'
import { getNetworkId } from '@siddomains/ui'

import ProfileCard from './ProfileCard'
import WidgetFunction from './WidgetFunction'
import DomainPanel from './DomainPanel'
import DomainList from './DomainList'

export default function Sidebar({ className }) {
  const [domainList, setDomainList] = useState([])
  const account = useAccount()

  const fetchDomainsList = async () => {
    const networkId = await getNetworkId()
    const params = {
      ChainID: networkId,
      Address: account
    }
    let result = await axios.post(
      'https://space-id-348516.uw.r.appspot.com/listname',
      params
    )
    console.log('result', result)
    console.log(result?.data)
    const data = result?.data?.map(item => {
      return {
        name: item?.name,
        expires_at: '2022.2.22'
      }
    })
    setDomainList(data)
  }

  useEffect(() => {
    console.log('account', account)
    if (account) {
      console.log(account)
      fetchDomainsList()
    }
    fetchDomainsList()
  }, [account])

  return (
    <div
      className={cn(
        'bg-[rgba(204,252,255,0.2)] backdrop-blur-sm rounded-[24px] p-[20px] min-h-[calc(100vh-180px)] flex flex-col justify-between',
        className
      )}
    >
      <div>
        <ProfileCard className="mb-4" />
        {/* <WidgetFunction className="mt-4 mb-4" /> */}
        <DomainPanel />
        <DomainList className="mt-4" domainsList={domainList} />
      </div>
      <div className="text-[#30DB9E] text-center text-[12px]">
        Learn how to manage your name
      </div>
    </div>
  )
}
