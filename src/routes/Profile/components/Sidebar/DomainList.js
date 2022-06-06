import React from 'react'
import cn from 'classnames'

import { Searchbar } from 'components/Input'
import { BarIcon } from 'components/Icons'
import ArrowIcon from 'components/Icons/ArrowIcon'

export default function DomainList({
  className,
  domainsList,
  clickHandle,
  selectedDomain
}) {
  return (
    <div className={cn('', className)}>
      <div className="flex justify-between items-center">
        <Searchbar className="mr-[14px]" />
        <BarIcon />
      </div>
      {domainsList.length > 0 ? (
        <div className="mt-4 relative max-h-[45vh] overflow-y-auto">
          {domainsList.map((item, index) => (
            <div
              onClick={() => {
                clickHandle(item, index)
              }}
              className={cn(
                'mb-5 w-full py-2 px-4 relative cursor-pointer',
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
