import React from 'react'
import cn from 'classnames'

export default function Drawer({ show, width, children }) {
  return (
    <div
      className={cn(
        `transition-all h-[100vh] fixed top-0 left-0`,
        show ? `w-${width}px` : 'w-0'
      )}
    >
      {children}
    </div>
  )
}
