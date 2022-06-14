import React from 'react'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { connectProvider, disconnectProvider } from 'utils/providerUtils'
import { switchWallet } from 'setup'
import { useQuery, gql } from '@apollo/client'
import { convertToETHAddressDisplayFormat } from 'utils/utils'
import { GET_REVERSE_RECORD } from 'graphql/queries'
import UnstyledBlockies from 'components/Blockies'
import SmileFace from '../../../../assets/images/profile/smileface.png'

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

export default function ProfileCard({ className, account }) {
  const domains = useSelector(state => state.domain.domains)

  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNT)

  console.log('accounts', accounts)

  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address: accounts?.[0]
    },
    skip: !accounts?.length
  })

  return (
    <div
      className={cn(
        'flex 1400px:min-w-[320px] account-profile-bg rounded-[16px] p-4 items-center',
        className
      )}
    >
      {account ? (
        <div className="mr-4 flex-none w-[40px] xl:w-[64px] h-[40px] md:h-[64px]">
          {!reverseRecordLoading &&
          getReverseRecord &&
          getReverseRecord.avatar ? (
            <img
              src={imageUrl(getReverseRecord.avatar, displayName, network)}
            />
          ) : (
            <div className="w-full h-full">
              {accounts && accounts.length > 0 ? (
                <UnstyledBlockies
                  className="rounded-full w-full h-full"
                  address={accounts[0]}
                  imageSize={45}
                />
              ) : (
                <img src={SmileFace} />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mr-4 flex-none w-[40px] xl:w-[64px]" />
      )}

      <div className="pr-10">
        {account !== '0x0000000000000000000000000000000000000000' ? (
          <div className="text-white font-semibold text-[18px]">
            {convertToETHAddressDisplayFormat(account)}
          </div>
        ) : (
          <div className="text-white font-semibold text-[18px]">
            (Unconnected)
          </div>
        )}

        <div>
          <span className="text-white text-[12px]">
            Domains - {domains.length}
          </span>
        </div>
        {account ? (
          <button
            className="bg-[#335264] rounded-full px-[8px] text-white font-semibold text-[12px]"
            onClick={() => {
              localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
              connectProvider()
            }}
          >
            Switch wallet
          </button>
        ) : (
          <button
            className="bg-[#335264] rounded-full px-[8px] text-white font-semibold text-[12px]"
            onClick={connectProvider}
          >
            Connect wallet
          </button>
        )}
      </div>
    </div>
  )
}
