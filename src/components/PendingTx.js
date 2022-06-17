import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import last from 'lodash/last'
import PropTypes from 'prop-types'
import styled from '@emotion/styled/macro'
import { useQuery } from '@apollo/client'
import { GET_TRANSACTION_HISTORY } from '../graphql/queries'

import Loader from './Loader'

const Pending = ({ className, children = 'Tx pending' }) => (
  <div className={cn('flex justify-center items-center', className)}>
    <span className="text-[12px] uppercase mr-[10px]">{children}</span>
    <Loader />
  </div>
)

function MultiplePendingTx(props) {
  const { txHashes, onConfirmed } = props
  const [txHashesStatus, setTxHashesStatus] = useState(txHashes)
  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )
  txHashesStatus.forEach(txHash => {
    transactionHistory.forEach(tx => {
      if (tx && tx.txHash === txHash && tx.txState === 'Confirmed') {
        const index = txHashesStatus.findIndex(tx => tx === txHash)
        const newTxHashesStatus = [...txHashesStatus]
        newTxHashesStatus[index] = 1
        setTxHashesStatus(newTxHashesStatus)

        if (
          newTxHashesStatus.reduce((acc, curr) => acc + curr) ===
          newTxHashesStatus.length
        ) {
          onConfirmed()
        }
      }
    })
  })
  return <Pending {...props} />
}

function PendingTx(props) {
  const { txHash, txHashes, onConfirmed } = props
  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )
  const lastTransaction = last(transactionHistory)
  useEffect(() => {
    if (
      onConfirmed &&
      lastTransaction &&
      lastTransaction.txHash === txHash &&
      lastTransaction.txState === 'Confirmed'
    ) {
      onConfirmed({
        blockCreatedAt: lastTransaction.createdAt
      })
    }
  }, [transactionHistory])
  if (txHashes) {
    return <MultiplePendingTx txHashes={txHashes} onConfirmed={onConfirmed} />
  }
  return <Pending {...props} />
}

PendingTx.propTypes = {
  txHash: PropTypes.string,
  txHashes: PropTypes.array,
  onConfirmed: PropTypes.func
}

export default PendingTx
