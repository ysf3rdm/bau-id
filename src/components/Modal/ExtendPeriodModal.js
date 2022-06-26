//Import packages
import React, { useEffect } from 'react'

//Import components
import Modal from './Modal'
import Pricer from 'components/SingleName/Pricer'
import EthRegistrationGasPrice from '../SingleName/NameRegister/EthRegistrationGasPrice'

export default function ExtendPeriodModal({
  show,
  saveHandler,
  closeModal,
  selectedDomain,
  duration,
  years,
  setYears,
  ethUsdPriceLoading,
  currentPremium,
  ethUsdPrice,
  price,
  rentPriceLoading,
  gasPrice,
  extendHandler
}) {
  return (
    <div>
      {show && (
        <Modal
          width="500px"
          showingCrossIcon={true}
          className="pt-[34px] pb-[36px] px-[24px]"
          closeModal={closeModal}
          cannotCloseFromOutside={true}
        >
          <div className="text-white font-bold text-[28px] text-center">
            Extend Registration
          </div>
          {Object.keys(gasPrice).length > 0 && (
            <div>
              <div className="text-white mt-4">
                <Pricer
                  className="justify-between"
                  name={selectedDomain.name}
                  duration={duration}
                  years={years}
                  setYears={setYears}
                  ethUsdPriceLoading={ethUsdPriceLoading}
                  ethUsdPremiumPrice={currentPremium}
                  ethUsdPrice={ethUsdPrice}
                  loading={rentPriceLoading}
                  price={price}
                />
              </div>
              <EthRegistrationGasPrice
                price={price}
                gasPrice={gasPrice}
                ethUsdPrice={ethUsdPrice}
              />
              <button
                className="bg-[#30DB9E] text-[#071A2F] text-[18px] py-2 px-[51px] rounded-full font-semibold flex mx-auto mt-6"
                onClick={() => {
                  extendHandler(duration)
                }}
              >
                Extend
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
