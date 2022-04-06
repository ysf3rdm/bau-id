import React, { Fragment, lazy, useEffect, useState } from 'react'
import {
  HashRouter,
  BrowserRouter,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import { useQuery } from '@apollo/client'

const TestRegistrar = lazy(() => import('./routes/TestRegistrar'))

const Home = lazy(() => import('./routes/Home'))

const SearchResults = lazy(() => import('./routes/SearchResults'))

const SingleName = lazy(() => import('./routes/SingleName'))

const Favourites = lazy(() => import('./routes/Favourites'))

const Faq = lazy(() => import('./routes/Faq'))

const Address = lazy(() => import('./routes/AddressPage'))

const Renew = lazy(() => import('./routes/Renew'))

const ErrorPage = lazy(() => import('./routes/ErrorPage'))

import { NetworkError, Error404 } from './components/Error/Errors'
import DefaultLayout from './components/Layout/DefaultLayout'
import { pageview, setupAnalytics } from './utils/analytics'
import useReactiveVarListeners from './hooks/useReactiveVarListeners'
import { GET_ERRORS } from './graphql/queries'

//If we are targeting an IPFS build we need to use HashRouter
const Router =
  process.env.REACT_APP_IPFS === 'True' ? HashRouter : BrowserRouter

const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => {
  pageview()
  return (
    <DefaultRoute
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  )
}

const App = () => {
  useReactiveVarListeners()
  const {
    data: { globalError }
  } = useQuery(GET_ERRORS)

  useEffect(() => {
    setupAnalytics()
  }, [])

  if (globalError.network) {
    return <NetworkError message={globalError.network} />
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} layout={HomePageLayout} />
        <Route path="/test-registrar" component={TestRegistrar} />
        <Route path="/favourites" component={Favourites} />
        <Route path="/faq" component={Faq} />
        <Route path="/my-bids" component={SearchResults} />
        <Route path="/how-it-works" component={SearchResults} />
        <Route path="/search/:searchTerm" component={SearchResults} />
        <Route path="/name/:name" component={SingleName} />
        <Route path="/address/:address/:domainType" component={Address} />
        <Route path="/address/:address" component={Address} />
        <Route path="/renew" component={Renew} />
        <Route path="/error" component={ErrorPage} />
        <Route path="*" component={Error404} />
      </Switch>
    </Router>
  )
}
export default App
