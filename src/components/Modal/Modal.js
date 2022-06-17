import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { CrossIcon } from 'components/Icons'
import cn from 'classnames'

function Modal({
  small,
  children,
  closeModal,
  width = '40%',
  cannotCloseFromOutside = false,
  showingCrossIcon = false,
  className = 'pt-6 pb-[36px] px-[40px]'
}) {
  const modalRoot = document.getElementById('modal-root')
  return ReactDOM.createPortal(
    <div
      className="fixed left-0 top-0 w-full h-full p-0 flex justify-center items-center bg-black/50"
      onClick={() => {
        if (!cannotCloseFromOutside) {
          closeModal()
        }
      }}
    >
      <div
        className={cn(
          `bg-[#0E4549] overflow-y-auto h-auto rounded-[24px] relative`,
          className
        )}
        style={{ width }}
        onClick={event => event.stopPropagation()}
        small={small}
      >
        {showingCrossIcon && (
          <div
            className="absolute right-[24px] top-[24px]"
            onClick={() => {
              closeModal()
            }}
          >
            <CrossIcon className="text-[#808080] cursor-pointer" size={11} />
          </div>
        )}

        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
