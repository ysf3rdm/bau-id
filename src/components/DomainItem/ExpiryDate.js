import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import {
  formatDate,
  calculateIsExpiredSoon,
  GRACE_PERIOD,
  PREMIUM_PERIOD
} from 'utils/dates'

const ExpiryDateContainer = styled('div')`
  font-size: 16px;
  font-weight: 100;
  order: 1;
  margin-right: 23px;
  color: ${({ isExpiredSoon }) => (isExpiredSoon ? 'red' : '#B1B1B1')};
  @media (max-width: 768px) {
    font-size: 12px;
    margin-right: 0px;
  }
`

const ExpiryDate = ({ expiryDate, domain, name }) => {
  let isExpiredSoon,
    isExpired,
    gracePeriodEndDate,
    isUnderPremiumSale,
    isInGracePeriod,
    endOfPremiumDate,
    message
  let { t } = useTranslation()
  const now = new Date()
  if (expiryDate) {
    isExpiredSoon = calculateIsExpiredSoon(expiryDate)
    isExpired = now > new Date(parseInt(expiryDate * 1000))
    gracePeriodEndDate = new Date((parseInt(expiryDate) + GRACE_PERIOD) * 1000)
    endOfPremiumDate = new Date(
      (parseInt(expiryDate) + GRACE_PERIOD + PREMIUM_PERIOD) * 1000
    )
    if (isExpired) {
      isInGracePeriod = now < gracePeriodEndDate
      isUnderPremiumSale = !isInGracePeriod && now < endOfPremiumDate
      if (isInGracePeriod) {
        message = `${t('singleName.expiry.gracePeriodEnds')} ${formatDate(
          gracePeriodEndDate
        )}`
      } else if (isUnderPremiumSale) {
        message = t('singleName.expiry.isUnderPremiumSale')
      } else {
        // sale under normal price
      }
    } else {
      // not expired
      message = `${t('c.expires')} ${formatDate(parseInt(expiryDate * 1000))}`
    }
  } else {
    return <span>&nbsp;</span>
  }
  return (
    <ExpiryDateContainer
      data-testid={`expiry-date-${name}`}
      isExpiredSoon={isExpiredSoon}
    >
      {message}
    </ExpiryDateContainer>
  )
}

export default ExpiryDate
