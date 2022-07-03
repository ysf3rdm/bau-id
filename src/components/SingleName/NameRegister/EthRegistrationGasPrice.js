import React from 'react'
import EthVal from 'ethval'
const GWEI = 1000000000
const COMMIT_GAS_WEI = 42000
const REGISTER_GAS_WEI = 240000
const TOGAL_GAS_WEI = COMMIT_GAS_WEI + REGISTER_GAS_WEI

const EthRegistrationGasPrice = ({ price, ethUsdPrice, gasPrice }) => {
  const ethVal = new EthVal(`${price || 0}`).toEth()
  const registerGasSlow = new EthVal(`${TOGAL_GAS_WEI * gasPrice.slow}`).toEth()
  const registerGasFast = new EthVal(`${TOGAL_GAS_WEI * gasPrice.fast}`).toEth()
  const totalSlow = ethVal.add(registerGasSlow)
  const totalFast = ethVal.add(registerGasFast)
  let totalInUsdSlow, totalInUsdFast
  // // No price oracle on Goerli
  if (ethUsdPrice) {
    totalInUsdSlow = totalSlow.mul(ethUsdPrice)
    totalInUsdFast = totalFast.mul(ethUsdPrice)
  }
  console.log('totalInUSDSlow', totalInUsdSlow)
  console.log('totalInUsdFast', totalInUsdFast)

  // totalInUsdFast
  return (
    <div>
      <div className="text-white py-[25px] border-y border-white border-dashed mt-6 px-6">
        <div className="flex justify-between">
          <div className="font-semibold text-[14px]">Registration</div>
          <div className="font-bold text-[16px]">{ethVal.toFixed(3)} BNBT</div>
        </div>
        <div className="flex justify-between mt-[14px]">
          <div className="font-semibold text-[14px]">Gas Fee</div>
          <div className="font-bold text-[16px]">
            {registerGasFast.toFixed(3)} BNBT
          </div>
        </div>
      </div>
      <div className="text-center text-white mt-6">
        <div className="text-[14px]">Total Cost</div>
        <div className="font-bold text-[36px]">
          ${totalInUsdFast?.toFixed(2) ?? 0}
        </div>
      </div>
    </div>
  )
}

export default EthRegistrationGasPrice
