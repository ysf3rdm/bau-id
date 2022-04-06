import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'
import { InlineLoader } from 'components/Loader'
import priceCalculator from './PriceCalculator'

const PriceContainer = styled('div')`
  width: 100%;
  text-align: center;
  font-family: Urbanist;
  ${mq.medium`
    width: 130px
  `}
`

const Value = styled('div')`
  font-family: Urbanist;
  font-weight: 100;
  font-size: 22px;
  color: #47c799;
  border-bottom: 1px solid #5ed6ab;
  height: 38px;
  align-items: center;
  display: flex;
  justify-content: center;
  ${mq.small`
    font-size: 24px;
  `}

  span {
    color: #379070;
  }
`

const Description = styled('div')`
  font-family: Urbanist;
  font-weight: 300;
  font-size: 12px;
  color: #adbbcd;
  margin-top: 3px;
  text-align: center;
`

const USD = styled('span')`
  font-size: 22px;
  color: #adbbcd;
  margin-left: 20px;
  ${mq.small`
    font-size: 28px;
  `}
`

const Price = ({
  loading,
  price,
  premiumOnlyPrice,
  ethUsdPrice,
  ethUsdPremiumPrice,
  underPremium
}) => {
  const { t } = useTranslation()
  let ethPrice = <InlineLoader />
  let withPremium, c
  if (!loading && price) {
    c = priceCalculator({
      price, // in ETH, BN
      premium: price, // in ETH
      ethUsdPrice
    })
    ethPrice = c.price
    if (underPremium) {
      withPremium =
        underPremium && ethUsdPremiumPrice
          ? `$${c.basePriceInUsd}(+$${c.premiumInUsd}) =`
          : null
    }
  }
  const priceInUsd = c?.priceInUsd
  return (
    <PriceContainer>
      <Value>
        {ethPrice} <span>BNBT</span>
        {withPremium && (
          <USD>
            {withPremium}${priceInUsd}
            USD
          </USD>
        )}
      </Value>
      <Description>
        {ethUsdPremiumPrice
          ? t('pricer.pricePerAmount')
          : t('pricer.registrationPriceLabel')}
      </Description>
    </PriceContainer>
  )
}

export default Price
