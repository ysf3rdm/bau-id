import ReactGA from 'react-ga4'
import { getNetworkId } from 'ui'

const TrackingID = {
  live: 'G-T851Y5QX1V',
  dev: 'G-Y8W54ERLDR',
}

function isProduction() {
  return window.location.host === 'app.space.id'
}

function isDev() {
  console.log(
    "window.location.host === 'localhost:3000'",
    window.location.host === 'localhost:3000'
  )
  return (
    window.location.host === 'app.stg.space.id' ||
    window.location.host === 'localhost:3000'
  )
}

async function isMainnet() {
  const id = await getNetworkId()
  return id === 1
}

export function setUtm() {
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  if (utmSource) {
    window.sessionStorage.setItem('utmSource', utmSource)
  }
}

export function getUtm() {
  return window.sessionStorage.getItem('utmSource')
}

export const setupAnalytics = () => {
  if (isProduction()) {
    ReactGA.initialize(TrackingID.live)
    // ReactGA.plugin.require('ecommerce')
  } else {
    ReactGA.initialize(TrackingID.dev)
    // ReactGA.plugin.require('ecommerce', { debug: true })
    console.log('Analytics setup for dev with ', TrackingID.dev)
  }
  // ReactGA.pageview(window.location.pathname + window.location.search)
  ReactGA.send({
    hitType: 'pageview',
    page: window.location.pathname + window.location.search,
  })
  setUtm()
}

export const trackReferral = async ({
  labels, // labels array
  transactionId, //hash
  type, // renew/register
  price, // in wei,
  premium = 0,
  years,
}) => {
  const mainnet = await isMainnet()
  const referrer = getUtm()
  const unitPrice = (price - premium) / years / labels.length

  function track() {
    ReactGA.event({
      category: 'referral',
      action: `${type} domain`,
      labels,
      transactionId,
      type,
      referrer,
    })
    ReactGA.plugin.execute('ecommerce', 'addTransaction', {
      id: transactionId, // Transaction ID. Required.
      affiliation: referrer, // Affiliation or store name.
      revenue: price, // Grand Total.
    })

    labels.forEach((label) => {
      ReactGA.plugin.execute('ecommerce', 'addItem', {
        id: transactionId,
        name: label,
        sku: label,
        category: type,
        price: unitPrice,
        quantity: years,
      })
      if (premium > 0) {
        ReactGA.plugin.execute('ecommerce', 'addItem', {
          id: transactionId,
          name: label,
          sku: label,
          category: type,
          price: premium,
          quantity: 1,
        })
      }
    })
    ReactGA.plugin.execute('ecommerce', 'send')
    ReactGA.plugin.execute('ecommerce', 'clear')
  }

  if (isProduction() && mainnet) {
    console.log('calling tracking from live')
    track()
    console.log('Completed tracking from live')
  } else if (isDev()) {
    console.log('calling tracking from dev')
    track()
    console.log('Completed tracking from dev')
  } else {
    console.log(
      'Referral triggered on local development',
      JSON.stringify({
        labels,
        transactionId,
        type,
        price,
        unitPrice,
        premium,
        years,
        referrer,
      })
    )
  }
}
