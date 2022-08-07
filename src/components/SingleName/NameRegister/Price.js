import React from 'react'
import { useTranslation } from 'react-i18next'
import { InlineLoader } from 'components/Loader'
import priceCalculator from './PriceCalculator'

const Price = ({
  loading,
  price,
  ethUsdPrice,
  ethUsdPremiumPrice,
  underPremium,
  discount,
  years,
  isAuctionWinner,
  registrationFee,
}) => {
  let ethPrice = <InlineLoader />
  let withPremium, c
  if (!loading && price) {
    c = priceCalculator({
      price, // in ETH, BN
      premium: price, // in ETH
      ethUsdPrice,
    })
    ethPrice =
      isAuctionWinner && years === 1
        ? c.price
        : (c.price / (1 - discount.percent / 100)).toFixed(3)
    if (underPremium) {
      withPremium =
        underPremium && ethUsdPremiumPrice
          ? `$${c.basePriceInUsd}(+$${c.premiumInUsd}) =`
          : null
    }
  }
  const priceInUsd = c?.priceInUsd
  return (
    <div>
      <div className="w-[120px] md:w-[180px] h-[40px] flex justify-center items-center font-bold font-urbanist bg-[#C4C4C4]/20 text-white font-bold font-urbanist text-[18px] rounded-[8px]">
        {registrationFee.toFixed(3)} <span>BNBT</span>
        {withPremium && (
          <span>
            {withPremium}${priceInUsd} USD
          </span>
        )}
      </div>
      <div className="text-center text-white font-semibold mt-1 text-[14px]">
        Registration Fee
      </div>
    </div>
  )
}

export default Price
