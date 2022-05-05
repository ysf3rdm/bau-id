import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled/macro'
import GlobalState from '../../globalState'
import mq from 'mediaQuery'

const ModalContent = styled('div')`
  background: white;
  padding: 20px;
  overflow-y: scroll;
  height: auto;
  ${mq.medium`
    padding: 40px;
    width: 70%;
  `};

  ${mq.large`
    width: 50%;
  `};

  ${p =>
    p.small
      ? `
    height: auto;
    width: auto;
  `
      : null};
`

function Modal({ small, children, closeModal, width = '40%' }) {
  const modalRoot = document.getElementById('modal-root')
  return ReactDOM.createPortal(
    <div
      className="fixed left-0 top-0 w-full h-full p-0 flex justify-center items-center bg-black/50"
      show
      onClick={closeModal}
    >
      <div
        className={`bg-[#0E4549] pt-6 pb-[36px] px-[40px] overflow-y-auto h-auto rounded-[24px] w-[${width}]`}
        onClick={event => event.stopPropagation()}
        small={small}
      >
        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
