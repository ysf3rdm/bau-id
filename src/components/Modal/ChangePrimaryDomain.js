// Import packages
import React, { useEffect, useState } from 'react'
import cn from 'classnames'

// Import components
import Modal from './Modal'
import { fetchRecords } from 'api/index'
import Select from 'components/Select/index'

export default function ChangePrimaryDomain({
  show,
  saveHandler,
  closeModal,
  loading,
  account,
  networkId,
}) {
  const [selected, setSelected] = useState(null)
  const [options, setOptions] = useState([])

  useEffect(() => {
    setSelected(null)
    if (show) {
      fetchRecords(account, networkId).then((res) => {
        const arr = res.map((item) => {
          return {
            value: item.name,
            label: item.name + '.bnb',
          }
        })
        setOptions(arr)
      })
    }
  }, [show])

  return (
    <div>
      {show && (
        <Modal
          width="560px"
          showingCrossIcon={true}
          className="pt-[34px] pb-[36px] px-5 md:px-[40px]"
          closeModal={closeModal}
          cannotCloseFromOutside={true}
        >
          {/* Title */}
          <div className="text-white">
            <div className="text-[24px] md:text-[28px] font-bold font-cocoSharp text-center">
              Primary SPACE ID Name
            </div>
          </div>
          {/* Body */}
          <div id="domain-modal-body" className="mt-5">
            <div className="text-base text-white font-urbanist">
              This will designate one of your SPACE ID names to represent your
              account and act as your cross-platform Web3 username and profile.
              You can only have one Primary SPACE ID Name per SPACE ID account
              and can change it at any time.
            </div>
            <div className="mt-5">
              <div className="text-base font-semibold text-white font-urbanist">
                Select one Space ID Name
              </div>
              <div>
                <Select
                  options={options}
                  onChange={(item) => {
                    setSelected(item)
                  }}
                />
              </div>
            </div>
            <div className="mt-5 text-gray-700">
              * Only SPACE ID names that point to your SPACE ID acount can be
              set as you Primary SPACE ID Name.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-center mt-5">
            <button
              disabled={!selected || loading}
              className={cn(
                'rounded-2xl py-2 px-[60px] text-[18px] mx-auto font-semibold',
                selected && !loading
                  ? 'bg-green-200 text-dark-common cursor-pointer'
                  : 'bg-gray-800 text-white cursor-not-allowed'
              )}
              onClick={() => saveHandler(selected)}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
