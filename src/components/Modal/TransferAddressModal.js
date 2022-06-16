import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { ethers } from '@siddomains/ui'
import Modal from './Modal'

const validate = values => {
  const errors = {}
  if (!ethers.utils.isAddress(values.address)) {
    errors.address = 'Address is not valid.'
  }
  return errors
}

export default function TransferAddressModal({
  show,
  saveHandler,
  closeModal,
  title,
  account
}) {
  const formik = useFormik({
    initialValues: {
      chain: 'BSC',
      address: ''
    },
    validate,
    onSubmit: values => {
      saveHandler(values)
    }
  })
  useEffect(() => {
    formik.resetForm()
  }, [show])
  return (
    <div>
      {show && (
        <Modal
          width="380px"
          showingCrossIcon={true}
          className="pt-[34px] pb-[36px] px-[40px]"
          closeModal={closeModal}
        >
          <div className="text-[white]">
            <div className="text-[28px] font-bold font-cocoSharp text-center">
              {title === 'registrant' ? 'Transfer Registrant' : `Set ${title}`}
            </div>
            <div className="text-urbanist mt-4">
              <div className="font-semibold">From address</div>
              <div className="text-[14px]">{account}</div>
            </div>
          </div>
          {/* Form for submitting transfer Registrant */}
          <form className="mt-4" onSubmit={formik.handleSubmit}>
            <div>
              <div className="text-white font-semibold">Chain</div>
              <input
                className="w-full bg-[rgba(72,143,139,0.25)] rounded-[12px] text-[#7E9195] text-[14px] py-[7px] px-4"
                id="chain"
                name="chain"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.chain}
                disabled
              />
            </div>
            <div className="mt-4">
              <div className="text-white font-semibold">
                Address<span className="text-red-800">*</span>
              </div>
              <input
                className="w-full bg-[rgba(72,143,139,0.25)] rounded-[12px] text-[#7E9195] text-[14px] py-[7px] px-4 focus:outline-0"
                placeholder="Enter the address"
                id="address"
                name="address"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
              {formik.errors.address ? (
                <div className="text-[#ED7E17] text-[12px] m-1">
                  {formik.errors.address}
                </div>
              ) : null}
            </div>
            <div className="text-[#BCC2D1] text-[14px] mt-4">
              <span className="text-red-800">*</span>Required field must be
              filled in.
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-[160px] bg-[#30DB9E] text-[#134757] rounded-[16px] h-[38px] flex justify-center items-center font-semibold mr-4"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
