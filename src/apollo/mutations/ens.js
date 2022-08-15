import { setupENS } from 'ui'
import { isENSReadyReactive } from '../reactiveVars'

let ens = {},
  registrar = {},
  ensRegistryAddress = undefined

export async function setup({
  enforceReadOnly,
  enforceReload,
  customProvider,
  ensAddress,
}) {
  try {
    let option = {
      reloadOnAccountsChange: false,
      enforceReadOnly,
      enforceReload,
      customProvider,
      ensAddress,
    }
    if (enforceReadOnly && process.env.REACT_APP_NETWORK_CHAIN_ID === '97') {
      option.infura =
        'https://bsc-testnet.nodereal.io/v1/c9bc598b84b14e62b11c0a1b74b37cbd'
    }
    const {
      ens: ensInstance,
      registrar: registrarInstance,
      providerObject,
    } = await setupENS(option)
    ens = ensInstance
    registrar = registrarInstance
    ensRegistryAddress = ensAddress
    isENSReadyReactive(true)
    return { ens, registrar, providerObject }
  } catch (err) {
    console.log('this is the error', err)
  }
}

export function getRegistrar() {
  return registrar
}

export function getEnsAddress() {
  return ensRegistryAddress
}

export default function getENS() {
  return ens
}
