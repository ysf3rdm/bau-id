import React, { Fragment, lazy, useEffect } from 'react'
import { BrowserRouter, Route as DefaultRoute, Switch } from 'react-router-dom'

import { useQuery } from '@apollo/client'

// Load components
const TestRegistrar = lazy(() => import('./routes/TestRegistrar'))
const Registration = lazy(() => import('./routes/Registration'))
const Home = lazy(() => import('./routes/Home'))
const SearchResults = lazy(() => import('./routes/SearchResults'))
const SingleName = lazy(() => import('./routes/SingleName'))
const Favorites = lazy(() => import('./routes/Favorites'))
const Faq = lazy(() => import('./routes/Faq'))
const Address = lazy(() => import('./routes/AddressPage'))
const Renew = lazy(() => import('./routes/Renew'))
const ErrorPage = lazy(() => import('./routes/ErrorPage'))

import { Error404 } from './components/Error/Errors'

import DefaultLayout from './components/Layout/DefaultLayout'
import HomePageLayout from 'components/Layout/HomePageLayout'

import useReactiveVarListeners from './hooks/useReactiveVarListeners'
import { GET_ERRORS } from './graphql/queries'

// const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => {
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

  console.log('globalError', globalError)

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} layout={HomePageLayout} />
        <Route
          exact
          path="/register/:domain"
          component={Registration}
          layout={HomePageLayout}
        />
        <Route path="/test-registrar" component={TestRegistrar} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/faq" component={Faq} />
        <Route path="/my-bids" component={SearchResults} />
        <Route path="/how-it-works" component={SearchResults} />
        <Route path="/search/:searchTerm" component={SearchResults} />
        <Route path="/name/:name" component={SingleName} layout={HomePageLayout}/>
        <Route path="/address/:address/:domainType" component={Address} />
        <Route path="/address/:address" component={Address} />
        <Route path="/renew" component={Renew} />
        <Route path="/error" component={ErrorPage} />
        <Route path="*" component={Error404} />
      </Switch>
    </BrowserRouter>
  )
}
export default App
