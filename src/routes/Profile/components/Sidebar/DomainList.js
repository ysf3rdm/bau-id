import React, { useState } from 'react'
import cn from 'classnames'

import { Searchbar } from 'components/Input'
import { BarIcon } from 'components/Icons'
import ArrowIcon from 'components/Icons/ArrowIcon'
import SortAscendingIcon from '../../../../components/Icons/SortAssendingIcon'
import SortDescendingIcon from 'components/Icons/SortDecendingIcon'
import TimeAscendingIcon from 'components/Icons/TimeAscendingIcon'
import TimeDecendingIcon from 'components/Icons/TimeDecendingIcon'

export default function DomainList({
  className,
  domainsList,
  clickHandle,
  selectedDomain
}) {
  const [searchKey, setSearchKey] = useState('')
  const [sortBy, setSortBy] = useState('')

  const onChangeHandler = event => {
    setSearchKey(event.target.value)
  }

  const handleSortBy = param => {
    switch (param) {
      case param === 'AToZ':
        setSortBy(param)
        break
      case param === 'ZToA':
        setSortBy(param)
        break
    }
  }

  return (
    <div className={cn('', className)}>
      <div className="flex justify-be tween items-center">
        <Searchbar className="mr-[14px]" onChangeHandler={onChangeHandler} />
        <div className="relative group h-full mt-[15px]">
          <BarIcon className="text-[#CCFCFF] cursor-pointer" />
          <div className="absolute z-[10] bg-[rgba(204,252,255,0.6)] rounded-[12px] p-3 hidden group-hover:block cursor-pointer top-[30px] right-[-20px] backdrop-blur-md">
            <SortAscendingIcon className="text-[#134757] border-b border-b-[rgba(67,140,136,0.25)] p-1" />
            <SortDescendingIcon className="text-[#134757] border-b border-b-[rgba(67,140,136,0.25)] p-1" />
            <TimeAscendingIcon className="text-[#134757] border-b border-b-[rgba(67,140,136,0.25)] p-1" />
            <TimeDecendingIcon className="text-[#134757] border-b border-b-[rgba(67,140,136,0.25)] p-1" />
          </div>
        </div>
      </div>
      {domainsList.length > 0 ? (
        <div className="mt-4 relative max-h-[60vh] overflow-y-auto">
          {domainsList
            .filter(item => item.name.includes(searchKey))
            .map((item, index) => (
              <div
                onClick={() => {
                  clickHandle(item, index)
                }}
                className={cn(
                  'mb-5 w-full py-2 px-4 relative cursor-pointer overflow-hidden break-all',
                  item.name === selectedDomain?.name
                    ? 'bg-[#1EEFA4] rounded-[16px]'
                    : ''
                )}
              >
                <div
                  className={cn(
                    item.name === selectedDomain?.name
                      ? 'text-[#071A2F] text-[20px]'
                      : 'text-[#30DB9E]',
                    'font-semibold text-[16px]'
                  )}
                >
                  {item.name}
                </div>
                <div
                  className={
                    ('text-[14px]',
                    cn(
                      item.name === selectedDomain?.name
                        ? 'text-[#2A9971]'
                        : 'text-[#BDCED1]'
                    ))
                  }
                >
                  expires {item.expires_at}
                </div>
                {item.name === selectedDomain?.name && (
                  <div className="absolute right-4 top-[calc(50%-7px)]">
                    <ArrowIcon />
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="text-[#BDCED1] text-[16px] text-center mt-[40px]">
          This address doesn't own any domain
        </div>
      )}
    </div>
  )
}
