import React from 'react'
import cn from 'classnames'
import ProfileCard from './ProfileCard'
import WidgetFunction from './WidgetFunction'
import DomainPanel from './DomainPanel'
import DomainList from './DomainList'

const domainsList = [
  // {name: "pepefrog.bnb", expires_at: '2022.2.22'},
  // {name: "wojak.bnb", expires_at: '2022.2.22'},
  // {name: "peepo.bnb", expires_at: '2022.2.22'},
]

export default function Sidebar({ className }) {
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
        <DomainList className="mt-4" domainsList={domainsList} />
      </div>
      <div className="text-[#30DB9E] text-center text-[12px]">
        Learn how to manage your name
      </div>
    </div>
  )
}
