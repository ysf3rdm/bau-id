import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import AddressBar from './AddressBar'
import TransferAddressModal from 'components/Modal/TransferAddressModal'
import PendingTx from 'components/PendingTx'

import { SET_REGISTRANT, SET_RESOLVER } from 'graphql/mutations'
import { useMutation } from '@apollo/client'
import { useEditable } from 'components/hooks'

import { refetchTilUpdatedSingle } from 'utils/graphql'
import { RECLAIM, SET_OWNER } from 'graphql/mutations'

import getENS, { getRegistrar } from 'apollo/mutations/ens'

export default function AddressList({
  className,
  sid,
  selectedDomain,
  canEdit,
  account
}) {
  const [controllerAddress, setControllerAddress] = useState('')
  const [resolverAddress, setResolverAddress] = useState('')
  const [registrantAddress, setRegistrantAddress] = useState('')
  const [title, setTitle] = useState('')
  const [isRegsitrant, setIsRegsitrant] = useState(false)

  const [loadingRegisteration, setLoadingRegisteration] = useState(true)
  const [loadingControllerAddress, setLoadingControllerAddress] = useState(true)
  const [loadingResolverAddress, setLoadingResolverAddress] = useState(true)
  const [transferShowModal, setTransferShowModal] = useState()
  const [mutationQuery, setMutationQuery] = useState(null)

  const { state, actions } = useEditable()

  const { editing, txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions

  const [mutation] = useMutation(mutationQuery ?? SET_REGISTRANT, {
    onCompleted: data => {
      const txHash = Object.values(data)[0]
      startPending(txHash)
    }
  })

  const refetchResolverAddress = async () => {
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const resolver = await nameUI.getResolver()
    return resolver
  }

  const fetchResolverAddress = async () => {
    try {
      const t_address = await refetchResolverAddress()
      setResolverAddress(t_address)
      setLoadingResolverAddress(false)
    } catch (err) {
      console.log(err)
    }
  }

  const refetchControllerAddress = async () => {
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const address = await nameUI.getOwner()
    return address
  }

  const fetchControllerAddress = async () => {
    const t_address = await refetchControllerAddress()
    setControllerAddress(t_address)
    setLoadingControllerAddress(false)
  }

  const fetchRegistrantAddress = async () => {
    const t_address = await refetchRegistrantAddress()
    setRegistrantAddress(t_address)
    if (t_address === account) setIsRegsitrant(true)
    setLoadingRegisteration(false)
  }

  const refetchRegistrantAddress = async () => {
    const registrar = getRegistrar()
    const entry = await registrar.getEntry(selectedDomain.name)
    return entry.registrant
  }

  useEffect(() => {
    if (sid && selectedDomain) {
      setLoadingRegisteration(true)
      setLoadingControllerAddress(true)
      setLoadingResolverAddress(true)
      fetchResolverAddress()
      fetchControllerAddress()
      fetchRegistrantAddress()
    }
  }, [sid, selectedDomain])

  // Transfer address
  const transferAddress = values => {
    setTransferShowModal(false)
    if (title === 'Registrant') {
      const variables = {
        address: values.address,
        name: selectedDomain.name
      }
      setMutationQuery(SET_REGISTRANT)
      mutation({
        variables
      })
    } else if (title === 'Controller') {
      setMutationQuery(isRegsitrant ? RECLAIM : SET_OWNER)
      const variables = {
        address: values.address,
        name: selectedDomain.name
      }
      mutation({
        variables
      })
    } else {
      setMutationQuery(SET_RESOLVER)

      var variables = {
        address: values.address,
        name: selectedDomain.name + '.bnb'
      }
      mutation({ variables })
    }
  }

  return (
    <React.Fragment>
      <div
        className={cn(
          'bg-[rgba(72,143,139,0.25)] rounded-[24px] xl:flex px-8 py-4',
          className
        )}
      >
        <div className="grid grid-cols-1 gap-y-3 1200px:grid-cols-3 gap-x-4 px-4 border-[rgba(204,252,255,0.2)]">
          <AddressBar
            clickHandler={() => {
              setTitle('Registrant')
              setTransferShowModal(true)
            }}
            loading={loadingRegisteration}
            address={registrantAddress}
            canEdit={canEdit}
            label="Registrant"
            clickHandlerLabel="Transfer"
            pending={
              editing ? null : pending && !confirmed && title === 'Registrant'
            }
            refetchAddress={refetchControllerAddress}
            fetchAddress={fetchControllerAddress}
            setConfirmed={setConfirmed}
            txHash={txHash}
          />
          <AddressBar
            clickHandler={() => {
              setTitle('Controller')
              setTransferShowModal(true)
            }}
            loading={loadingControllerAddress}
            address={controllerAddress}
            canEdit={canEdit}
            label="Controller"
            clickHandlerLabel="Set"
            pending={
              editing ? null : pending && !confirmed && title === 'Controller'
            }
            refetchAddress={refetchControllerAddress}
            fetchAddress={fetchControllerAddress}
            setConfirmed={setConfirmed}
            txHash={txHash}
          />
          <AddressBar
            clickHandler={() => {
              setTitle('Resolver')
              setTransferShowModal(true)
            }}
            loading={loadingResolverAddress}
            address={resolverAddress}
            canEdit={canEdit}
            label="Resolver"
            clickHandlerLabel="Set"
            pending={
              editing ? null : pending && !confirmed && title === 'Resolver'
            }
            refetchAddress={refetchResolverAddress}
            fetchAddress={fetchResolverAddress}
            setConfirmed={setConfirmed}
            txHash={txHash}
          />
        </div>
      </div>
      <TransferAddressModal
        title={title}
        show={transferShowModal}
        saveHandler={transferAddress}
        account={account}
        closeModal={() => setTransferShowModal(false)}
        address={
          title === 'Registrant'
            ? registrantAddress
            : title === 'Controller'
            ? controllerAddress
            : resolverAddress
        }
      />
    </React.Fragment>
  )
}
