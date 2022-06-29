// Import packages
import React, { useState } from 'react'
import cn from 'classnames'
import { useMutation } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// Import components
import UnstyledBlockies from 'components/Blockies'
import ChangePrimaryDomain from 'components/Modal/ChangePrimaryDomain'
import PendingTx from 'components/PendingTx'

//Import graphql queries
import { GET_REVERSE_RECORD } from 'graphql/queries'
import { SET_NAME } from 'graphql/mutations'
import { refetchTilUpdatedSingle } from 'utils/graphql'

//Import custom functions
import { connectProvider } from 'utils/providerUtils'
import { useQuery, gql } from '@apollo/client'
import { convertToETHAddressDisplayFormat } from 'utils/utils'
import { useEditable } from 'components/hooks'

//Import Redux
import { setAllDomains } from 'app/slices/domainSlice'

//Import assets
import SmileFace from '../../../../assets/images/profile/smileface.png'

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

export default function ProfileCard({
  className,
  account,
  isReadOnly,
  networkId
}) {
  const [isShowChangePrimaryModal, setIsShowChangePrimaryModal] = useState(
    false
  )
  const domains = useSelector(state => state.domain.domains)

  const dispatch = useDispatch()

  const primaryDomain = domains.filter(item => item.isPrimary)

  const { actions, state } = useEditable()

  const { startPending, setConfirmed } = actions
  const { pending, txHash } = state

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

  const [setName] = useMutation(SET_NAME, {
    onCompleted: data => {
      if (Object.values(data)[0]) {
        startPending(Object.values(data)[0])
        setIsShowChangePrimaryModal(false)
      }
    }
  })

  const changePrimaryDomain = param => {
    setName({ variables: { name: param.value } })
  }

  const refetchPrimaryDomain = async () => {
    const params = {
      ChainID: networkId,
      Address: account
    }
    let result = await axios.post(
      'https://space-id-348516.uw.r.appspot.com/listname',
      params
    )
    const data = result?.data?.map(item => {
      const date = new Date(item?.expires)
      return {
        expires_at: `${date.getFullYear()}.${date.getMonth() +
          1}.${date.getDate()}`,
        ...item
      }
    })
    return data
  }

  const fetchPrimaryDomain = async () => {
    const result = await refetchPrimaryDomain()
    dispatch(setAllDomains(result))
  }

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
          <div className="w-full">
            {pending ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={async () => {
                  refetchTilUpdatedSingle({
                    refetch: refetchPrimaryDomain,
                    interval: 300,
                    keyToCompare: 'name',
                    prevData:
                      primaryDomain && primaryDomain.length > 0
                        ? primaryDomain
                        : ''
                  })
                  await fetchPrimaryDomain()
                  setConfirmed()
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center mt-[5px] justify-between">
                {primaryDomain && primaryDomain.length === 0 ? (
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
                ) : (
                  <div className="flex justify-between w-full">
                    <div className="text-[#1EEFA4] text-[14px] truncate max-w-[120px]">
                      {primaryDomain[0].name + '.bnb'}
                    </div>
                    <button
                      className="bg-[#335264] rounded-full px-[8px] text-white font-semibold text-[12px]"
                      onClick={() => {
                        setIsShowChangePrimaryModal(true)
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-white">-</div>
        )}
        <ChangePrimaryDomain
          show={isShowChangePrimaryModal}
          saveHandler={changePrimaryDomain}
          closeModal={() => setIsShowChangePrimaryModal(false)}
          domains={domains}
        />
      </div>
    </div>
  )
}
