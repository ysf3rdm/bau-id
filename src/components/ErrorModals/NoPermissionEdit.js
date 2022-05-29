import React, { useState } from 'react'
import Modal from 'components/Modal/Modal'

export default function NoPermissionEdit() {
  const [show, setShow] = useState(true)
  const close = () => {
    setShow(false)
  }
  return (
    <React.Fragment>
      {show && (
        <Modal width="424px">
          <div className="text-[white]">
            <div className="text-[28px] font-cocoSharp text-center font-bold">
              Ooops...
            </div>
            <div className="text-urbanist font-semibold text-center mt-4">
              You do not have the access to edit the account.
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => close()}
                className="mt-[36px] bg-[#30DB9E] rounded-full text-[14px] font-[urbanist] py-2 px-[68px] text-[#134757] font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  )
}
