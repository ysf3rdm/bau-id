import React from 'react'
import cn from 'classnames'

export default function WidgetFunction({ className }) {
  const noAnnouncement = true
  return (
    <div
      className={cn('w-full bg-[#7E9195] rounded-[16px] h-[44px]', className)}
    />
  )
}
