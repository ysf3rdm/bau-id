import React from 'react'
import cn from 'classnames'
import ClickAwayListener from 'react-click-away-listener'

export default function Drawer({ show, width, children, closeDrawer }) {
  return (
    <>
      <div
        className={cn(
          `transition-width duration-200 ease-in-out h-[100vh] fixed top-0 left-0 bg-[rgba(204,252,255,0.2)] backdrop-blur-3xl rounded-r-[24px] z-[100]`,
          show ? `w-[420px]` : 'w-0'
        )}
      >
        {show && (
          <ClickAwayListener
            onClickAway={() => {
              closeDrawer()
            }}
          >
            <div className="w-full h-[100vh]">{children}</div>
          </ClickAwayListener>
        )}
      </div>
    </>
  )
}
