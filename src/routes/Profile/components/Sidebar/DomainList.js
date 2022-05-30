import React from 'react'
import cn from 'classnames'

import { Searchbar } from 'components/Input'
import { BarIcon } from 'components/Icons'
import ArrowIcon from 'components/Icons/ArrowIcon'

const active = 0

export default function DomainList({ className, domainsList }) {
  return (
    <div className={cn('', className)}>
      <div className="flex justify-between items-center">
        <Searchbar className="mr-[14px]" />
        <BarIcon />
      </div>
      {domainsList.length > 0 ? (
        <div className="mt-4 relative">
          {domainsList.map((item, index) => (
            <div
              className={cn(
                'mb-5 w-full py-2 px-4 relative cursor-pointer',
                active === index ? 'bg-[#1EEFA4] rounded-[16px]' : ''
              )}
            >
              <div
                className={cn(
                  active === index
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
                  cn(active === index ? 'text-[#2A9971]' : 'text-[#BDCED1]'))
                }
              >
                expires {item.expires_at}
              </div>
              {active === index && (
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
