import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import AddressBar from './AddressBar'
import TransferAddressModal from 'components/Modal/TransferAddressModal'
import PendingTx from 'components/PendingTx'

import { SET_REGISTRANT } from 'graphql/mutations'
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

  const fetchInfo = async () => {
    try {
      const nameUI = sid.name(`${selectedDomain.name}.bnb`)
      const resolver = await nameUI.getResolver()
      setResolverAddress(resolver)
      setLoadingResolverAddress(false)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchControllerAddress = async () => {
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const address = await nameUI.getOwner()
    setControllerAddress(address)
    setLoadingControllerAddress(false)
  }

  const fetchRegistrantAddress = async () => {
    const registrar = getRegistrar()
    const entry = await registrar.getEntry(selectedDomain.name)
    setRegistrantAddress(entry.registrant)
    if (entry.registrant === account) setIsRegsitrant(true)
    setLoadingRegisteration(false)
  }

  useEffect(() => {
    if (sid && selectedDomain) {
      setLoadingRegisteration(true)
      setLoadingControllerAddress(true)
      setLoadingResolverAddress(true)
      fetchInfo()
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
          {editing ? null : pending && !confirmed ? (
            <PendingTx
              txHash={txHash}
              onConfirmed={() => {
                refetchTilUpdatedSingle({
                  refetch,
                  interval: 300,
                  keyToCompare: 'registrant',
                  prevData: {
                    singleName: selectedDomain.name
                  },
                  getterString: 'singleName'
                })
                setConfirmed()
              }}
            />
          ) : (
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
            />
          )}
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
          />
        </div>
      </div>
      <TransferAddressModal
        title={title}
        show={transferShowModal}
        saveHandler={transferAddress}
        account={account}
        closeModal={() => setTransferShowModal(false)}
      />
    </React.Fragment>
  )
}
