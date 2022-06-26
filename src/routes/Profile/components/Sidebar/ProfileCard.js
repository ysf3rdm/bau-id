// Import packages
import React, { useState } from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'

// Import components
import UnstyledBlockies from 'components/Blockies'
import ChangePrimaryDomain from 'components/Modal/ChangePrimaryDomain'

//Import graphql queries
import { GET_REVERSE_RECORD } from 'graphql/queries'

//Import custom functions
import { connectProvider } from 'utils/providerUtils'
import { useQuery, gql } from '@apollo/client'
import { convertToETHAddressDisplayFormat } from 'utils/utils'

//Import assets
import SmileFace from '../../../../assets/images/profile/smileface.png'

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

export default function ProfileCard({ className, account, isReadOnly }) {
  const [isShowChangePrimaryModal, setIsShowChangePrimaryModal] = useState(
    false
  )
  const domains = useSelector(state => state.domain.domains)

  const primaryDomain = domains.filter(item => item.isPrimary)

  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNT)

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

      <div className="w-full">
        {!isReadOnly ? (
          <div className="text-white font-semibold text-[18px]">
            {convertToETHAddressDisplayFormat(account)}
          </div>
        ) : (
          <div className="text-white font-semibold text-[18px]">
            (Unconnected)
          </div>
        )}

        <div>
          <span className="text-white text-[12px]">Primary SPACE ID Name:</span>
        </div>
        {account && !isReadOnly ? (
          <div className="flex items-center mt-[5px] justify-between">
            {primaryDomain && primaryDomain.length === 0 ? (
              <div>
                <button
                  className="bg-[#335264] rounded-full px-[8px] text-white font-semibold text-[12px]"
                  onClick={() => {
                    // localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
                    // connectProvider()
                    setIsShowChangePrimaryModal(true)
                  }}
                >
                  Add Primary domain
                </button>
              </div>
            ) : (
              <div>
                <div className="text-[#1EEFA4] text-[14px]">pepefrong.bnb</div>
                <button
                  className="bg-[#335264] rounded-full px-[8px] text-white font-semibold text-[12px]"
                  onClick={() => {
                    localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
                    connectProvider()
                  }}
                >
                  Change
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-[#335264] rounded-full px-[8px] text-white font-semibold text-[12px]"
            onClick={connectProvider}
          >
            Connect wallet
          </button>
        )}
        <ChangePrimaryDomain
          show={isShowChangePrimaryModal}
          saveHandler={() => {}}
          closeModal={() => setIsShowChangePrimaryModal(false)}
          domains={domains}
        />
      </div>
    </div>
  )
}
