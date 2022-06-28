import React, { useState } from 'react'
import cn from 'classnames'
import moment from 'moment'

//Import Components
import CopyIcon from 'components/Icons/CopyIcon'

//Import Assets
import NotifyIcon from 'components/Icons/NotifyIcon'
import AnimationSpin from 'components/AnimationSpin'
import PendingTx from 'components/PendingTx'

//Import GraphQL
import { refetchTilUpdatedSingle } from 'utils/graphql'
import { Tooltip } from '../../../../components/Tooltip/Tooltip'

export default function TopAddress({
  className,
  selectedDomain,
  registrantAddress,
  loadingRegistration,
  transferRegistrantAddress,
  pending,
  setConfirmed,
  refetchAddress,
  fetchAddress,
  address,
  txHash,
  extendHandler,
  isRegsitrant,
  pendingExpirationDate = false
}) {
  const [tooltipMessage, setTooltipMessage] = useState('Copy to clipboard')

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  const handleCopyRegistrantAddress = e => {
    e.preventDefault()
    copyTextToClipboard(registrantAddress)
      .then(() => {
        alert('copied')
      })
      .catch(err => {
        alert('err')
      })
  }
  return (
    <div className={cn('grid grid-cols-2 gap-x-[28px]', className)}>
      <div
        className={`relative w-fit 1400px:w-[432px] h-[272px] flex items-center text-center rounded-[20px] bg-cover`}
        style={{ backgroundImage: `url(/assets/images/name-card.png)` }}
      >
        <div class="w-fit mx-auto px-3">
          <span className="h-full text-[40px] font-bold text-white break-all">
            <span className="">{`${
              selectedDomain?.name.length > 12
                ? selectedDomain?.name.substring(0, 4) +
                  '...' +
                  selectedDomain?.name.substring(
                    selectedDomain?.name.length - 4,
                    selectedDomain?.name.length
                  )
                : selectedDomain?.name
            }`}</span>
            <span className="text-[#1EEFA4]">.bnb</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between py-2 w-[447px]">
        <div>
          <p className="font-bold text-[24px] text-[#1EEFA4]">Registrant</p>
          {loadingRegistration ? (
            <AnimationSpin />
          ) : (
            <div>
              {pendingExpirationDate ? (
                <PendingTx
                  txHash={txHash}
                  onConfirmed={async () => {
                    refetchTilUpdatedSingle({
                      refetch: refetchAddress,
                      interval: 300,
                      keyToCompare: 'registrant',
                      prevData: address
                    })
                    await fetchAddress()
                    setConfirmed()
                  }}
                  className="mt-1"
                />
              ) : (
                <div className="flex text-[18px] text-white font-semibold items-center mt-2">
                  <p>{registrantAddress}</p>
                  <div className="ml-2" onClick={handleCopyRegistrantAddress}>
                    <Tooltip message={tooltipMessage}>
                      <CopyIcon />
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          )}
          {!pending && !loadingRegistration && (
            <div className="flex items-center mt-4">
              <button
                disabled={pending || !isRegsitrant}
                className={cn(
                  'py-2 px-6 rounded-full mr-4 font-semibold',
                  pending || !isRegsitrant
                    ? 'bg-[#7E9195] text-white'
                    : 'bg-[#30DB9E] text-[#134757]'
                )}
                onClick={transferRegistrantAddress}
              >
                Transfer
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-[20px] text-[#1EEFA4]">
              Expiration Date
            </p>

            {pending ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={async () => {
                  refetchTilUpdatedSingle({
                    refetch: refetchAddress,
                    interval: 300,
                    keyToCompare: 'registrant',
                    prevData: address
                  })
                  await fetchAddress()
                  setConfirmed()
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex text-[18px] text-white font-semibold items-center mt-2">
                {/* <p>2023.04.22 at 08:00 (UTC+8:00)</p> */}
                <p>
                  {moment(
                    selectedDomain?.expires_at
                      .split(',')[0]
                      .replaceAll('.', '-')
                  ).format('YYYY.MM.DD')}
                  <span className="mx-1">at</span>
                  {moment(
                    selectedDomain?.expires_at
                      .split(',')[0]
                      .replaceAll('.', '-')
                  ).format('hh:mm')}
                  <span className="ml-1">(UTC+8:00)</span>
                </p>
                {/* <div className="ml-2">
                  <NotifyIcon />
                </div> */}
              </div>
            )}
          </div>
          <div>
            <button
              className="text-[#134757] font-semibold text-[16px] py-2 px-[28px] rounded-full bg-[#30DB9E]"
              onClick={extendHandler}
            >
              Extend
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
