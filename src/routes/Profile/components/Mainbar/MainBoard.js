import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { useQuery } from '@apollo/client'
import { getNamehash, emptyAddress } from '@siddomains/ui'
import { formatsByCoinType } from '@siddomains/address-encoder'

import union from 'lodash/union'
import { Address } from 'components/Addresses'
import {
  GET_RESOLVER_FROM_SUBGRAPH,
  GET_ADDRESSES,
  GET_TEXT_RECORDS
} from 'graphql/queries'

import EmailImg from 'assets/images/profile/email.png'
import WebsiteImg from 'assets/images/profile/website.png'
import AvatarImg from 'assets/images/profile/avatar.png'
import DescriptionImg from 'assets/images/profile/description.png'
import TwitterImg from 'assets/images/profile/twitter.png'
import DiscordImg from 'assets/images/profile/discord.png'
import GithubImg from 'assets/images/profile/github.png'
import TelegramImg from 'assets/images/profile/telegram.png'

import { toggleEditMode } from 'app/slices/accountSlice'

import TEXT_PLACEHOLDER_RECORDS from 'constants/textRecords'

import EVMImg from 'assets/images/profile/evm.png'
import BTCImg from 'assets/images/profile/btc.png'
import LTCImg from 'assets/images/profile/ltc.png'
import { AddNewButton } from 'components/Button'

import COIN_LIST from 'constants/coinList'
import { convertToETHAddressDisplayFormat } from '../../../../utils/utils'
import CopyIcon from 'components/Icons/CopyIcon'
import Info from 'components/Icons/Info'
import AnimationSpin from 'components/AnimationSpin'

const haveAddresses = true
const haveProfile = true

const COIN_PLACEHOLDER_RECORDS = ['ETH', ...COIN_LIST.slice(0, 3)]

const addressesData = [
  {
    id: 1,
    title: 'EVM',
    description: '0x0000......000000',
    imageUrl: EVMImg,
    bgColorClass: 'bg-[rgba(89,128,201,0.6)]'
  },
  {
    id: 1,
    title: 'BTC',
    description: '3FZbgi......tktZc5',
    imageUrl: BTCImg,
    bgColorClass: 'bg-[rgba(167,129,80,0.6)]'
  },
  {
    id: 1,
    title: 'LTC',
    description: 'MGxNPP......2465zN',
    imageUrl: BTCImg,
    bgColorClass: 'bg-[rgba(99,124,165,0.6)]'
  }
]

function isContentHashEmpty(hash) {
  return hash?.startsWith('undefined') || parseInt(hash, 16) === 0
}

const useGetRecords = domain => {
  const { data: dataResolver } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(domain.name + '.bnb')
    }
  })

  const resolver =
    dataResolver && dataResolver.domain && dataResolver.domain.resolver

  const coinList =
    resolver &&
    resolver.coinTypes &&
    resolver.coinTypes
      .map(c => {
        return formatsByCoinType[c] && formatsByCoinType[c].name
      })
      .filter(c => c)

  const { loading: addressesLoading, data: dataAddresses } = useQuery(
    GET_ADDRESSES,
    {
      variables: {
        name: domain.name + '.bnb',
        keys: union(coinList, COIN_PLACEHOLDER_RECORDS)
      },
      fetchPolicy: 'network-only'
    }
  )

  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name + 'bnb',
        keys: union(resolver && resolver.texts, TEXT_PLACEHOLDER_RECORDS)
      },
      fetchPolicy: 'network-only'
    }
  )
  return {
    dataAddresses,
    dataTextRecords,
    recordsLoading: addressesLoading || textRecordsLoading
  }
}

const processRecords = (records, placeholder) => {
  const nonDuplicatePlaceholderRecords = placeholder.filter(
    record => !records.find(r => record === r.key)
  )

  const recordsSansEmpty = records.map(record => {
    if (record.value === emptyAddress) {
      return { ...record, value: '' }
    }
    return record
  })

  return [
    ...recordsSansEmpty,
    ...nonDuplicatePlaceholderRecords.map(record => ({
      key: record,
      value: ''
    }))
  ]
}

const getInitialTextRecords = (dataTextRecords, domain) => {
  const textRecords =
    dataTextRecords && dataTextRecords.getTextRecords
      ? processRecords(dataTextRecords.getTextRecords, TEXT_PLACEHOLDER_RECORDS)
      : processRecords([], TEXT_PLACEHOLDER_RECORDS)

  return textRecords?.map(textRecord => ({
    contractFn: 'setText',
    ...textRecord
  }))
}

const getInitialCoins = dataAddresses => {
  const addresses =
    dataAddresses && dataAddresses.getAddresses
      ? processRecords(dataAddresses.getAddresses, COIN_PLACEHOLDER_RECORDS)
      : processRecords([], COIN_PLACEHOLDER_RECORDS)

  return addresses?.map(address => ({
    contractFn: 'setAddr(bytes32,uint256,bytes)',
    ...address
  }))
}

const getInitialContent = domain => {
  return {
    contractFn: 'setContenthash',
    key: 'CONTENT',
    value: isContentHashEmpty(domain.content) ? '' : domain.content
  }
}

const getInitialRecords = (domain, dataAddresses, dataTextRecords) => {
  const initialTextRecords = getInitialTextRecords(dataTextRecords, domain)
  var initialCoins = getInitialCoins(dataAddresses)

  initialCoins[0].key = 'EVM'
  const initialContent = getInitialContent(domain)

  return [...initialTextRecords, ...initialCoins, initialContent]
}

const useInitRecords = (
  domain,
  dataAddresses,
  dataTextRecords,
  setInitialRecords
) => {
  useEffect(() => {
    setInitialRecords(getInitialRecords(domain, dataAddresses, dataTextRecords))
  }, [domain, dataAddresses, dataTextRecords])
}

export default function MainBoard({
  selectedDomain,
  className,
  resolverAddress,
  loadingResolverAddress
}) {
  const editOn = useSelector(state => state.account.profileEditMode)

  const { dataAddresses, dataTextRecords, recordsLoading } = useGetRecords(
    selectedDomain
  )

  const [initialRecords, setInitialRecords] = useState([])

  useInitRecords(
    selectedDomain,
    dataAddresses,
    dataTextRecords,
    setInitialRecords
  )

  const handleResolverAddressCopy = e => {
    e.preventDefault()
    e.clipboardData.setData('Text', resolverAddress)
  }

  return (
    <div className={cn(className)}>
      <div className="bg-[rgba(67,140,136,0.25)] rounded-[24px] p-5">
        <p className="text-[#B1D6D3] font-bold text-[20px]">Records</p>
        <div className="bg-[rgba(67,140,136,0.25)] rounded-[24px] flex items-center justify-between py-[19px] px-6 mt-5">
          <div>
            <p className="text-[#B1D6D3] font-bold text-[20px]">BNB Address</p>
            <div className="flex items-center text-[#B1D6D3] text-[18px] mt-1">
              <p className="mr-2">0xb794f5ea0ba39494ce839613fffba74279579268</p>
              <span className="cursor-pointer">
                <CopyIcon />
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <Info />
            <button className="text-white py-2 px-[40px] bg-[#7E9195] rounded-full ml-4">
              Edit
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 mt-8 flex justify-between">
        {loadingResolverAddress ? (
          <AnimationSpin />
        ) : (
          <div>
            <p className="text-[#B1D6D3] font-bold text-[20px]">Resolver</p>
            <div className="flex items-center text-[#B1D6D3] text-[18px] mt-1">
              <p className="mr-2">{resolverAddress}</p>
              <div
                className="cursor-pointer"
                onClick={e => handleResolverAddressCopy(e)}
              >
                <CopyIcon />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <Info />
          <button className="text-white py-2 px-[40px] bg-[#7E9195] rounded-full ml-4">
            Set
          </button>
        </div>
      </div>
    </div>
  )
}
