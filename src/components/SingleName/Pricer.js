import React from 'react'
import styled from '@emotion/styled/macro'
import Years from './NameRegister/Years'
import Price from './NameRegister/Price'
import EthRegistrationGasPrice from './NameRegister/EthRegistrationGasPrice'
import { ReactComponent as DefaultOrangeExclamation } from '../Icons/OrangeExclamation.svg'
import mq from 'mediaQuery'
import { ReactComponent as ChainDefault } from '../Icons/chain.svg'
import { useTranslation } from 'react-i18next'

const PricingContainer = styled('div')`
  display: flex;
  margin-bottom: 20px;
`
const Chain = styled(ChainDefault)`
  display: block;
  margin-top: 9px;
  margin-left: 34px;
  margin-right: 24px;
  flex: none;
  @media (max-width: 768px) {
    margin-left: 14px;
    margin-right: 14px;
  }
`

const Prompt = styled('div')`
  color: #ff9052;
  font-size: 11px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

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
      {years <= 1 && (
        <Prompt>
          <div>*{t('register.increaseRegistrationPeriod')}</div>
        </Prompt>
      )}
      <PricingContainer className={className} ref={reference}>
        <Years years={years} setYears={setYears} />
        <Chain />
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
      </PricingContainer>
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
