import { getProvider, setupWeb3, getNetworkId, getNetwork } from './web3'
import { ENS } from './ens.js'
import { setupRegistrar } from './registrar'
export { utils, ethers } from 'ethers'

export async function setupENS({
  customProvider,
  ensAddress,
  reloadOnAccountsChange,
  enforceReadOnly,
  enforceReload,
  infura,
} = {}) {
  const { provider } = await setupWeb3({
    customProvider,
    reloadOnAccountsChange,
    enforceReadOnly,
    enforceReload,
    infura,
  })
  let networkId = await getNetworkId()
  console.log('networkId', networkId)
  const ens = new ENS({ provider, networkId, registryAddress: ensAddress })
  console.log('ens', ens)
  const registrar = await setupRegistrar(ens.registryAddress)
  console.log('registrar', registrar)
  const network = await getNetwork()
  return {
    ens,
    registrar,
    provider: customProvider,
    network,
    providerObject: provider,
  }
}

export * from './ens'
export * from './registrar'
export * from './web3'
export * from './constants/interfaces'
export * from './utils'
export * from './contracts'
