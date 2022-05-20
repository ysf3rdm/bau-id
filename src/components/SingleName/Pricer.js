import React from 'react'
import styled from '@emotion/styled/macro'
import Years from './NameRegister/Years'
import Price from './NameRegister/Price'
import EthRegistrationGasPrice from './NameRegister/EthRegistrationGasPrice'
import { useTranslation } from 'react-i18next'

function PricerInner({
  years,
  setYears,
  duration,
  ethUsdPriceLoading,
  ethUsdPrice,
  ethUsdPremiumPrice,
  className,
  loading,
  price,
  premiumOnlyPrice,
  gasPrice,
  reference,
  underPremium,
  displayGas = false
}) {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex items-center" ref={reference}>
        <Years years={years} setYears={setYears} />
        <span className="text-white font-bold font-urbanist text-[18px] flex pt-2 mr-[13px]">
          =
        </span>
        <Price
          price={price}
          premiumOnlyPrice={premiumOnlyPrice}
          gasPrice={gasPrice}
          loading={loading}
          ethUsdPriceLoading={ethUsdPriceLoading}
          ethUsdPrice={ethUsdPrice}
          ethUsdPremiumPrice={ethUsdPremiumPrice}
          underPremium={underPremium}
        />
      </div>
      {displayGas && gasPrice && (
        <div>
          <EthRegistrationGasPrice
            price={price}
            gasPrice={gasPrice}
            loading={loading}
            ethUsdPriceLoading={ethUsdPriceLoading}
            ethUsdPrice={ethUsdPrice}
            ethUsdPremiumPrice={ethUsdPremiumPrice}
            underPremium={underPremium}
          />
        </div>
      )}
    </>
  )
}

export const PricerAll = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

const Pricer = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

export default Pricer
