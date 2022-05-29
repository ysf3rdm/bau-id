import React from 'react'
import cn from 'classnames'
import ProfileCard from './ProfileCard'
import WidgetFunction from './WidgetFunction'
import DomainPanel from './DomainPanel'

export default function Sidebar({ className }) {
  return (
    <div
      className={cn(
        'bg-[rgba(204,252,255,0.2)] backdrop-blur-sm rounded-[24px] p-[20px] min-h-[calc(100vh-180px)] flex flex-col justify-between',
        className
      )}
    >
      <div>
        <ProfileCard />
        <WidgetFunction className="mt-4 mb-4" />
        <DomainPanel />
      </div>
      <div className="text-[#30DB9E] text-center text-[12px]">
        Learn how to manage your name
      </div>
    </div>
  )
}
